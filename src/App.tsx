// App.tsx
import React, { useState, useEffect } from 'react';
import { VictoryChart, VictoryScatter, VictoryLine, VictoryAxis, VictoryTheme } from 'victory';
import Papa from 'papaparse';

type Point = {
  x: number;
  y: number;
};

const App: React.FC = () => {
  const [points, setPoints] = useState<Point[]>([]);
  const [method, setMethod] = useState<'mmq' | 'lagrange' | 'newton'>('mmq');
  const [degree, setDegree] = useState<number>(2);
  const [polynomialString, setPolynomialString] = useState<string>('');
  const [curveData, setCurveData] = useState<Point[]>([]);

  // ----- MÉTODOS DE INTERPOLAÇÃO -----

  // MMQ (Mínimos Quadrados)
  const mmqPolynomial = (points: Point[], degree: number): ((x: number) => number) => {
    const n = points.length, d = degree;
    const A = Array.from({ length: d + 1 }, () => Array(d + 1).fill(0));
    const b = Array(d + 1).fill(0);
    const sums: number[] = [];
    for (let k = 0; k <= 2 * d; k++) {
      sums[k] = points.reduce((acc, pt) => acc + Math.pow(pt.x, k), 0);
    }
    for (let i = 0; i <= d; i++) {
      for (let j = 0; j <= d; j++) {
        A[i][j] = sums[i + j];
      }
    }
    for (let i = 0; i <= d; i++) {
      for (let k = 0; k < n; k++) {
        b[i] += Math.pow(points[k].x, i) * points[k].y;
      }
    }
    const coeffs = solveLinearSystem(A, b);
    // Cria uma representação textual (simplificada) do polinômio
    let polyStr = coeffs
      .map((coef, i) => `${coef.toFixed(2)}${i > 0 ? "x^" + i : ""}`)
      .join(" + ");
    setPolynomialString(polyStr);
    return (x: number) => {
      let y = 0;
      for (let i = 0; i <= d; i++) {
        y += coeffs[i] * Math.pow(x, i);
      }
      return y;
    }
  };

  // Resolução do sistema linear via eliminação Gaussiana
  const solveLinearSystem = (A: number[][], b: number[]): number[] => {
    const n = A.length;
    const M = A.map((row, i) => [...row, b[i]]);
    for (let i = 0; i < n; i++) {
      let maxRow = i;
      for (let k = i + 1; k < n; k++) {
        if (Math.abs(M[k][i]) > Math.abs(M[maxRow][i])) maxRow = k;
      }
      [M[i], M[maxRow]] = [M[maxRow], M[i]];
      if (Math.abs(M[i][i]) < 1e-12) throw new Error("Pivô zero.");
      for (let k = i + 1; k < n; k++) {
        const factor = M[k][i] / M[i][i];
        for (let j = i; j <= n; j++) {
          M[k][j] -= factor * M[i][j];
        }
      }
    }
    const x = Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
      x[i] = M[i][n] / M[i][i];
      for (let k = i - 1; k >= 0; k--) {
        M[k][n] -= M[k][i] * x[i];
      }
    }
    return x;
  };

  // Interpolação de Lagrange
  const lagrangePolynomial = (points: Point[]): ((x: number) => number) => {
    const sorted = [...points].sort((a, b) => a.x - b.x);
    // Neste exemplo, apenas indicamos que é o polinômio de Lagrange
    setPolynomialString("Polinômio de Lagrange (não simplificado)");
    return (x: number) => {
      let result = 0;
      const n = sorted.length;
      for (let i = 0; i < n; i++) {
        let term = sorted[i].y;
        for (let j = 0; j < n; j++) {
          if (i !== j) term *= (x - sorted[j].x) / (sorted[i].x - sorted[j].x);
        }
        result += term;
      }
      return result;
    }
  };

  // Interpolação de Newton
  const newtonPolynomial = (points: Point[]): ((x: number) => number) => {
    const sorted = [...points].sort((a, b) => a.x - b.x);
    const n = sorted.length;
    const xs = sorted.map(pt => pt.x);
    const coeffs: number[] = [];
    const dd = sorted.map(pt => pt.y);
    coeffs.push(dd[0]);
    for (let i = 1; i < n; i++) {
      for (let j = 0; j < n - i; j++) {
        dd[j] = (dd[j + 1] - dd[j]) / (xs[j + i] - xs[j]);
      }
      coeffs.push(dd[0]);
    }
    // Representação textual simplificada
    let polyStr = coeffs
      .map((coef, i) => 
        i === 0 
          ? coef.toFixed(2) 
          : `${coef.toFixed(2)}*${[...Array(i)].map((_, j) => `(x-${xs[j].toFixed(2)})`).join("")}`
      )
      .join(" + ");
    setPolynomialString(polyStr);
    return (x: number) => {
      let result = 0, prod = 1;
      for (let i = 0; i < n; i++) {
        if (i > 0) prod *= (x - xs[i - 1]);
        result += coeffs[i] * prod;
      }
      return result;
    }
  };

  // ----- UPLOAD DE CSV -----

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length) {
      const file = e.target.files[0];
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        complete: function(results) {
          // Espera colunas "x" e "y" no CSV
          const data = results.data as any[];
          const pts: Point[] = data.map(row => ({ x: Number(row.x), y: Number(row.y) }));
          setPoints(pts);
        }
      });
    }
  };

  // ----- CALCULA A CURVA INTERPOLADORA -----

  useEffect(() => {
    if (points.length < 2) return;
    let f: (x: number) => number;
    try {
      if (method === "mmq") {
        if (points.length < degree + 1) {
          setPolynomialString("Para MMQ, é preciso ter pelo menos (grau+1) pontos.");
          setCurveData([]);
          return;
        }
        f = mmqPolynomial(points, degree);
      } else if (method === "lagrange") {
        f = lagrangePolynomial(points);
      } else if (method === "newton") {
        f = newtonPolynomial(points);
      }
    } catch (error: any) {
      setPolynomialString("Erro na interpolação: " + error.message);
      setCurveData([]);
      return;
    }
    // Gera dados da curva amostrando 100 pontos entre o mínimo e máximo de x
    const xs = points.map(pt => pt.x);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const step = (maxX - minX) / 100;
    let curve: Point[] = [];
    for (let x = minX; x <= maxX; x += step) {
      curve.push({ x, y: f(x) });
    }
    setCurveData(curve);
  }, [points, method, degree]);

  // ----- RENDERIZAÇÃO -----

  return (
    <div style={{ display: 'flex', flexDirection: 'row', padding: 20 }}>
      {/* Área do gráfico */}
      <div style={{ flex: 1, marginRight: 20 }}>
        <h2>Gráfico de Interpolação</h2>
        <VictoryChart theme={VictoryTheme.material} domainPadding={20}>
          <VictoryAxis label="X" />
          <VictoryAxis dependentAxis label="Y" />
          <VictoryScatter
            data={points}
            size={4}
            style={{ data: { fill: "red" } }}
          />
          {curveData.length > 0 && (
            <VictoryLine
              data={curveData}
              style={{
                data: { stroke: "blue", strokeWidth: 2 }
              }}
            />
          )}
        </VictoryChart>
      </div>
      {/* Painel de configurações */}
      <div style={{ width: '300px', border: '1px solid #ccc', padding: 20, borderRadius: 8 }}>
        <h3>Configurações</h3>
        <div>
          <label>Upload CSV: </label>
          <input type="file" accept=".csv" onChange={handleFileChange} />
        </div>
        <div style={{ marginTop: 10 }}>
          <label>Método: </label>
          <select value={method} onChange={e => setMethod(e.target.value as any)}>
            <option value="mmq">MMQ</option>
            <option value="lagrange">Lagrange</option>
            <option value="newton">Newton</option>
          </select>
        </div>
        {method === "mmq" && (
          <div style={{ marginTop: 10 }}>
            <label>Grau: </label>
            <input type="number" value={degree} onChange={e => setDegree(Number(e.target.value))} min={1} />
          </div>
        )}
        <div style={{ marginTop: 10 }}>
          <h4>Polinômio Gerado:</h4>
          <p>{polynomialString}</p>
        </div>
        <div style={{ marginTop: 10 }}>
          <button onClick={() => setPoints([])}>Limpar Pontos</button>
        </div>
      </div>
    </div>
  );
};

export default App;
