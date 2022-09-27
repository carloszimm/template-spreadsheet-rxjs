# Template Spreadsheet RxJS
Um template básico que pode ser utilizado para a atividade em laboratório que consiste em construir um spreadsheet remoto.

# Estado Atual
O arquivo `spreadsheet-rx.html` provê atualmente um spreadsheet com dimensões 26x26 que é construído dinamicamente ao carregar a página. Cada célula possui 2 elementos de input HTML do tipo texto, ambos dividindo a mesma célula. Sem qualquer interação com a célula, o valor renderizado corresponde ao valor de um dos inputs que modela o valor computado para a célula. Para este input o chamaremos de `valInput` (input de valor). O segundo input possuí o atributo `hidden` (escondido) e apenas torna-se visível (`hidden` == false) no momento em que há interação com a célula (isto é, quando há um click numa célula); neste momento o `valInput` torna-se hidden. Para esse segundo input chamaremos de `expInput` (input de expressão) que corresponde a expressão que deverá ser utilizada para computar o valor a ser mostrado no `valInput`. Todo esse mecanismo está disponível no arquivo `js/rxjs.js` nas funções `buildEnterExitStreams` e `buildBussinessLogicStream` que são executadas quando o template é construído (arquivo `js/main.js`). Como ponto de partida, você pode utilizar a função `buildBussinessLogicStream` que tem acesso tanto a `valInput` como a `expInput` e é chamada durante a construção da tabela (spreadsheet).

## RxJS
RxJS já está disponível no projeto e pode ser acessado da seguinte forma:

```javascript
const { from, fromEvent, of } = rxjs; //funções factory
const { filter, map, tap, startWith, flatMap } = rxjs.operators; //operadores de pipeline
```

## CellParser
Para facilitar e fazer com que vocês possam se concentrar na lógica de negócios, o template já disponibiliza um objeto global (`CellParser`) que poderá ser utilizado para fazer o parse da expressão fornecida por `expInput`. Através do uso do método `parse` no qual recebe uma string, um objeto é retornado com o formato geral de acordo com o seguinte esquema:

```javascript
{
  value: string | number | object,
  isEmptyString: () => boolean,
  isNumber: () => boolean,
  isReference: () => boolean,
  isOperation: () => boolean,
  isError: () => boolean
}
```

Cada método desse objeto construído pode ser usado para entender o tipo de expressão passada (string vindo do `expInput`) e assim estruturar a lógica de negócios. O campo `value` pode conter até três tipos de dados dependendo da expressão passada como argumento:

* string: Se for um refência a outra célula ou se a expressão foi mal formatada (nesse caso o `value` terá uma string `ERROR`)
* number: Se for um número
* object: Se foi uma operação do tipo ADD(parâmetros), SUB(parâmetros), MUL(parâmetros) ou DIV(parâmetros)

O objeto contido em `value` (para os casos mencionados acima) seguem o seguinte esquema:
```javascript
{
  opeartion: string,
  params: [object]
}
```
O campo `operation` contém o tipo de operação solicitada (ADD, SUB, MUL ou DIV). Já o campo `params` contém um array de objetos seguindo o mesma esquema quando analisadas pelo método [`CellParser.parse`](#cellparser); isto é, cada parâmetro é analisado de forma recursiva chamando `parse`.
