# Documentação da API

## Upload de Arquivo

**Descrição:** Este endpoint permite o upload de arquivos que contenham dados de pagamento. Os arquivos podem estar no formato `.txt` ou `.xlsx`.

**Método HTTP:** POST  
**Endpoint:** `/v1/upload`  
**Headers:** `{'Content-Type': 'multipart/form-data'}`  
**Parâmetros:** 
- `file`: O arquivo a ser enviado (formato `.txt` ou `.xlsx`)

**Exemplo cURL:**
```bash
curl --request POST \
  --url http://localhost:3000/v1/upload \
  --header 'content-type: multipart/form-data' \
  --form 'file=@D:\caminho\do\arquivo\exemplo.xlsx_ou_txt'
Resposta: 200 OK para sucesso ou uma mensagem de erro caso ocorra falha no upload.


## Visualização Paginada dos Dados

**Descrição:** Este endpoint permite a visualização paginada dos dados do arquivo após o upload.

**Método HTTP:** GET  
**Endpoint:** `/v1/data/paginated`  
**Headers:** `{'Content-Type': 'application/json'}`  
**Parâmetros:** 
- `page`: Número da página a ser retornada
- `pageSize`: Quantidade de registros por página

**Exemplo cURL:**
```bash
curl --request GET \
  --url 'http://localhost:3000/v1/data/paginated?page=1&pageSize=5'
Resposta: 200 OK. Um objeto paginado contendo os dados do arquivo.


## Busca por ID Específico

**Descrição:** Este endpoint permite buscar dados por um ID específico.

**Método HTTP:** GET  
**Endpoint:** `/v1/data/{id}`  
**Parâmetros:** 
- `id`: O ID do dado a ser buscado

**Exemplo cURL:**
```bash
curl --request GET \
  --url http://localhost:3000/v1/data/4532402d-fda1-4ad1-b0d7-8c0fae7bce8f
Resposta: 200 OK. Dados relacionados ao ID.


## Atualização de Dados

**Descrição:** Permite a atualização de um dado específico, fornecendo os campos que precisam ser modificados.

**Método HTTP:** PUT  
**Endpoint:** `/v1/data/{id}`  
**Headers:** `{'Content-Type': 'application/json'}`  
**Parâmetros:** 
- `id`: O ID do dado a ser atualizado

**Exemplo cURL:**
```bash
curl --request PUT \
  --url http://localhost:3000/v1/data/4532402d-fda1-4ad1-b0d7-8c0fae7bce8f \
  --header 'Content-Type: application/json' \
  --data '{ "name": "Novo Nome", "age": "30", "address": "Novo Endereço", "cpf": "12345678901", "paidAmount": 100.50, "birthDate": "19900101" }'
Resposta: 200 OK. Dados atualizados com sucesso.


## Deleção de Dados

**Descrição:** Permite a exclusão de um dado específico pelo seu ID.

**Método HTTP:** DELETE  
**Endpoint:** `/v1/data/{id}`  
**Parâmetros:** 
- `id`: O ID do dado a ser excluído

**Exemplo cURL:**
```bash
curl --request DELETE \
  --url http://localhost:3000/v1/data/bb00212a-5f06-4973-88d8-5f646a57f582
Resposta: 200 OK. Dado deletado com sucesso.


## Confirmação e Auditoria de Dados

**Descrição:** Confirma dados verificados e os torna permanentes em um banco de dados específico. Esses dados são imutáveis, garantindo integridade para auditorias.

**Método HTTP:** POST  
**Endpoint:** `/v1/permanent-data`  
**Headers:** `{'Content-Type': 'application/json'}`  
**Parâmetros:** 
- `ids`: Lista de IDs a serem confirmados

**Exemplo cURL:**
```bash
curl --request POST \
  --url http://localhost:3000/v1/permanent-data \
  --header 'Content-Type: application/json' \
  --data '{"ids": ["d9a20250-6ece-46a3-a297-6308d7c97b87"]}'
Resposta: 200 OK. Dados confirmados e armazenados de forma permanente.


## Exportação de Dados para CSV

**Descrição:** Exporta os dados selecionados para um arquivo CSV, conforme exigências de auditoria.

**Método HTTP:** POST  
**Endpoint:** `/v1/export-data`  
**Headers:** `{'Content-Type': 'application/json'}`  
**Parâmetros:** 
- `ids`: Lista de IDs a serem exportados

**Exemplo cURL:**
```bash
curl --request POST \
  --url http://localhost:3000/v1/export-data \
  --header 'Content-Type: application/json' \
  --data '{"ids": ["8dac1795-f446-4f0e-9733-d683ee351fec", "d9a20250-6ece-46a3-a297-6308d7c97b87"]}'
Resposta: 200 OK. Arquivo CSV contendo os dados solicitados.




## Informações Úteis

Para rodar a API em sua máquina, siga estes passos:

1. Clone o repositório.
2. Execute o seguinte comando:
   ```bash
   docker-compose up --build

Caso haja algum problema com o SQLite (que é usado somente para desenvolvimento), entre no terminal do container e execute os seguintes comandos:
 ```bash
    npx prisma migrate status
    npx prisma migrate deploy

## Agradecimento:
Obrigado por utilizar nossa API! Se tiver dúvidas ou precisar de suporte adicional, não hesite em entrar em contato. Apreciamos seu feedback e estamos aqui para ajudar.
