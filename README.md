Todos os direitos reservados a https://baasic.com.br

-- COMO RODAR A APLICAÇÃO --
Requisitos Básicos: Ter o Docker e Node.Js baixados, e ter a virtualização do computador ativada.
OBS: Todos os comandos deverão ser executados no terminal.
Após isso, é essencial que o usuário use o comando git clone para clonar o repositório.
utilize o comando code . para entrar no vscode para acessar a aplicação.

-- COMANDOS PARA A INSTALAÇÃO --

-- BACKEND -- 
OBS: Todos os comandos deverão ser executados no terminal do VSCODE(de preferência)
1. O usuário vai precisar navegar até o backend, utilizando o comando cd backend.
2. após isso, o usuário vai precisar executar o comando npm install, para instalar todas as dependências do backend.
3. Com a instalação concluída, o usuário terá que executar o comando npm run build.
-- INDO PARA O FRONTEND --
1. Com todos os comandos feitos no backend, o usuário vai navegar até o frontend, com os comandos cd .. e logo em seguida cd frontend.
-- FRONTEND -- 
1. O mesmo comando npm install será utilizado no frontend.
-- FAZENDO O BUILDING DO DOCKER --
1. Com tudo feito em ambos(backend e frontend), o usuário vai dar cd .. para voltar à pasta inicial.

2. Com isso, é necessário que o usuário verifique o arquivo "docker-compose.yml" e ver se na linha 44 existe o comando " npm run db:migrate && npm run db:seed && ", caso não exista, adicionar o comando.

3. Com todos os processos já feitos, o usuário vai escrever o comando "docker-compose up --build" com o Docker aberto e esperar a build ser feita.

-- APÓS FAZER A BUILD -- 
1. quando a build tiver sido feita, o usuário terá que excluir o comando " npm run db:migrate && npm run db:seed && " no arquivo "docker-compose.yml", e caso queira rodar a 2. aplicação de novo, substituir o comando "docker-compose up --build" para: "docker-compose up"
