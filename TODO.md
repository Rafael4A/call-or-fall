# TODO

## Regras:

- Na primeira rodada cada jogador recebe uma carta, na segunda recebem duas, na terceira três, e assim por diante.
- SOMENTE NA PRIMEIRA rodada o jogador não vê a própria carta, apenas as dos outros
- Antes de toda rodada começar, cada jogador diz a previsão de quantos jogos acha que vai ganhar. Ex.: se está na terceira rodada (cada jogador possui três cartas) o jogador deve dizer quantas dessas três ele acha que ganha. Para ganhar é preciso ter a maior carta jogada entre todos jogadores
- Quem errar sua previsão recebe pontos (quanto mais pontos pior)
- A somada das previsões não pode ser igual ao número de cartas nas mãos. Ex.: Na terceira rodada Alice diz que vai ganhar duas, Bob diz que vai ganhar zero, Carol não pode dizer que vai ganhar uma pois somaria 3 (2 de Alice, 0 de Bob e 1 de Carol) ela precisa dizer zero, dois ou três
- Caso duas(ou mais) cartas de mesmo valor sejam jogadas, elas se anulam, e não valem nada.

## Tasks (TODO):

- Jogar carta
- Avaliar rodada e atribuir pontos, depois disparar nova rodada
- Finalizar partida e mostrar ranking
- Opção de desistir durante a partida.
- Cancelar partida (só o criador da sala pode cancelar) antes de começar a partida e durante
- remover jogador da partida caso socket desconecte no lobby
- Compartilhar link de convite para a sala
- Handler de erros de API
- Refactor view passada por props para context
- Refactor room para vir de context
- Clear room id when leaving room, game ends, or new room is created
- Enviar reações (somente partidas online)
- Bots (partida offline)
- Melhorar visual drasticamente
- Opção de mostrar borda dourada na carta ganhando -> Mod escolhe ao criar partida
- Lógica de aviso de player desconectado? -> modal imperativa? primeiro usar alert
- Aviso para qualquer erro de backend com toast

## Tasks (Done):

- Criar sala
- Entrar na sala
- Outros jogadores entrarem na sala
- Iniciar partida
- Predizer quantas jogadas vai ganhar

## API endpoints (Mostly Done):

- POST /room
  - recebe: username
  - retorna: roomId, userId
- PATCH /room (NOT DONE)
  - recebe: userId do criador, configuração: limite de pontos, exibir carta ganhadora...
  - retorna: 200 OK
- GET /room/:id
  - recebe: id por path, userId por header(ou query param)
  - retorna: users[{name,hasCurrentTurn,score}], limite de pontos, estado do jogo, cartas jogadas

## Verificar antes de concluir:

- adicionar evento no socket de oponente desconectado
- reconectar ao recarregar
- lidar com erros da api
- Terminar TODOs
- reafatorar state da view para context
- tirar console.logs

## Features:

- Partidas online com até 8 jogadores simultâneos
- Partidas com jogadores reais e bots misturados
- Funcionamento offline através de PWA com cache para jogar contra bots
- Comunicação em tempo real usando WebSockets
