# Jogo da Senha

Interface web inspirada no layout fornecido e adaptada para reproduzir a lógica educacional do projeto em C.

## Arquivos

- `index.html` — estrutura da página.
- `style.css` — visual, responsividade e animações.
- `script.js` — lógica do jogo.

## Como executar

Basta abrir o arquivo `index.html` em um navegador moderno.

Não é necessário instalar Node.js, bibliotecas ou servidor.

## Regras implementadas

- Senha aleatória entre 100 e 999.
- Senhas com três dígitos iguais são sorteadas novamente.
- O jogador informa três dígitos.
- A aplicação informa quantos dígitos aparecem na senha.
- A aplicação informa quantos estão na posição correta.
- Uma mesma posição da senha não é contabilizada duas vezes.
- O contador registra o número de tentativas.
- `Desistir e revelar senha` encerra a partida mostrando o código.
- `Nova partida` gera uma nova senha.
