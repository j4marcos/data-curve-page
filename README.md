# Interpolação de Curvas

Este projeto foi desenvolvido como trabalho de Cálculo Numérico no curso de Ciência da Computação da UFPB. O objetivo do projeto é demonstrar diferentes métodos de interpolação de curvas (MMQ, Lagrange e Newton) aplicados a um conjunto de pontos, os quais podem ser inseridos manualmente por meio de cliques no canvas ou carregados a partir de um arquivo (CSV ou TXT).

## Funcionalidades

- **Captura Dinâmica de Pontos:**  
  Os pontos podem ser adicionados dinamicamente clicando no canvas. Além disso, é possível fazer upload de um arquivo com os dados (em formato CSV ou TXT) para que os pontos sejam automaticamente posicionados e escalonados no canvas.

- **Métodos de Interpolação:**  
  - **MMQ (Mínimos Quadrados):** Permite especificar o grau do polinômio. O gráfico é atualizado dinamicamente quando o grau é alterado.  
  - **Lagrange:** Calcula a função interpoladora via método de Lagrange e exibe uma representação simbólica simplificada do polinômio resultante.  
  - **Newton:** Utiliza o método de Newton para interpolação e converte a representação para a forma padrão.

- **Visualização:**  
  - O canvas exibe os pontos capturados, a curva interpolada e os eixos (X e Y) com marcações (ticks) e valores, permitindo uma melhor visualização dos dados e da proporção.
  - Um painel de erros exibe mensagens de alerta sempre que houver algum problema na interpolação (por exemplo, número insuficiente de pontos para um determinado grau).
  - Um painel dedicado mostra o polinômio gerado de forma simplificada, facilitando a análise dos resultados.

## Como Funciona

1. **Inserção de Pontos:**  
   Clique no canvas para adicionar pontos manualmente.  
   Para carregar pontos a partir de um arquivo, use a opção de _upload_ e selecione um arquivo CSV ou TXT com duas colunas separadas por vírgula ou ponto-e-vírgula.

2. **Seleção do Método de Interpolação:**  
   Utilize os botões na sidebar para selecionar o método desejado (MMQ, Lagrange ou Newton).  
   - Ao selecionar MMQ, é possível definir o grau do polinômio. A cada alteração no grau, o gráfico é atualizado automaticamente.

3. **Visualização dos Resultados:**  
   - O canvas exibe os pontos e a curva interpolada de acordo com o método selecionado.
   - Os eixos com ticks e valores são desenhados dinamicamente.
   - O painel do polinômio mostra a expressão simplificada da função interpoladora.
   - Se ocorrer algum erro (como número insuficiente de pontos), o painel de erros exibirá uma mensagem descritiva.

4. **Limpar Canvas:**  
   Clique no botão "Limpar" para reiniciar o canvas e remover todos os pontos e mensagens.

## Como Usar

1. Abra o arquivo `index.html` em um navegador moderno.
2. Para adicionar pontos manualmente, clique na área do canvas.
3. Para carregar um conjunto de pontos, utilize a opção de upload e selecione um arquivo com os dados.
4. Escolha o método de interpolação desejado (MMQ, Lagrange ou Newton) usando os botões da sidebar.  
   - No caso do MMQ, ajuste o grau desejado no campo disponível.
5. Observe o resultado da interpolação no canvas, os valores dos eixos, os erros (se houver) e a representação do polinômio no painel correspondente.
6. Utilize o botão "Limpar" para reiniciar a sessão e testar novos conjuntos de pontos ou métodos.

## Como Foi Feito

Este projeto foi desenvolvido utilizando **HTML**, **CSS** e **JavaScript**. As principais funcionalidades, como o desenho do canvas, a captura de pontos, a interpolação dos dados e a exibição dos resultados, foram implementadas com funções JavaScript que:

- Capturam os pontos via eventos de clique no canvas ou por meio do upload de arquivo.
- Aplicam algoritmos numéricos para interpolação:  
  - **MMQ:** Calcula os coeficientes por meio da resolução de sistemas lineares.  
  - **Lagrange:** Constrói o polinômio interpolador e também gera uma representação simbólica simplificada.  
  - **Newton:** Utiliza diferenças divididas e converte a representação para a forma padrão.
- Geram a visualização dinâmica dos pontos, eixos com escalas e a curva interpolada.
- Exibem mensagens de erro e a representação simplificada do polinômio em painéis dedicados.

### Utilização do ChatGPT

O desenvolvimento deste projeto contou com o auxílio do [ChatGPT](https://openai.com/blog/chatgpt) da OpenAI, que foi utilizado para:
- Sugerir melhorias e organizar o código de forma modular.
- Auxiliar na implementação dos algoritmos de interpolação e na resolução de problemas específicos (como a conversão para a forma padrão do polinômio e o desenho dos eixos com ticks).
- Prover exemplos de código e explicações detalhadas para cada funcionalidade.

## Licença

Este projeto é de uso livre para fins educacionais.

---

