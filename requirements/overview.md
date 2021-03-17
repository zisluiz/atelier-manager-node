# Sistema de gestão de atelier de costura

Ateliês pequenos de costura e modelagem de roupas costumam necessitar de ferramentas para auxiliar o controle de tempo despendido nas tarefas de produção. Também possuem dificuldade para medir os custos de produção e controle de receitas e despesas. 

## Objetivos

Sistematizar a gestão dos processos de modelagem, serviços (ajustes, roupas sob medida) e controlar receitas/despesas.

A principal funcionalidade para controle de serviços e tempo gasto nas tarefas deve possuir uma boa usabilidade para que seja fácil e rápido realizar os registros no sistema.

De início, todos os usuários cadastrados possuem acesso total aos mesmos dados.

## Funcionalidades:

### 1. Autenticação

Autenticação por usuário e senha.

### 2. Cadastro de bases de serviços:   
Listagem e cadastro.

Campos:
* Nome
* Peças 
    * Nome
    * Tipo de serviço (Modelagem, Ajustes, Sob-medida) e etapas de cada peça. 
    * Preço unitário    
    * Quantidade
    * Etapas

#### Exemplo: Ajuste de calça jeans
* Peça: Calça Jeans
    * Tipo de serviço: Ajuste
    * Preço unitário: R$ 20,00
    * Quantidade: 1
    * Etapas:
        * Atendimento
            * Recursos:
                * Atendimento pessoal: R$ 0,00, 10:00 (10 minutos)
        * Desmanche
        * Costura
            * Recursos:
                * Máquinas: R$ 1,00/h
        * Entrega
            * Recursos:
                * Entrega dos serviços: R$ 0,00, 10:00 (10 minutos)*    

### 3. Cadastro de etapas de serviços:
Listagem e cadastro.

Campos:
* Nome da etapa
* Recursos

### 4. Cadastro de recursos:
Listagem e cadastro.

Campos:
* Nome
* Custo fixo/hora estimado
* Tempo de trabalho padrão (HH:mm:ss)

### 5. Cadastro de clientes
Listagem e cadastro.

Campos:
* Nome
* Telefones
* Endereço
### 6. Requisição de serviço: 
Haverá uma listagem de serviços, com filtro ativo por serviços em andamento/concluídos. Filtros adicionais: status (registrado, em andamento, concluído, pago), cliente, período, situação (todos, ativo, excluído).

Na inclusão de um serviço, deverão ser informados os seguintes dados:
* Base de serviço
* Cliente
* Prazo de conclusão
* Observação (opcional)
* Anexo de arquivos
* Especificação do trabalho (peças) [virá por padrão da base de serviço selecionados, permitindo alterar/adicionar/remover novos]:
    * Nome
    * Quantidade
    * Preço unitário
    * Tipos de serviços
    * Etapas:
        * Nome
        * Recursos:
            * Nome
            * Custo em hora/fixo
            * Tempo de trabalho padrão

Ao salvar e dar início à execução do serviço, o sistema apresenta novas opções, além das anteriores:

* Valor/hora do serviço
* Valor cobrado
* Adicionar receitas (pagamentos), despesas (compra de tecidos ESPECÍFICOS PARA O SERVIÇO);
* Adicionar tempo de execução para as peças/etapas. O usuário poderá cronometrar/informar o tempo despendido na tarefa por unidade de peça e etapa, ou por unidades de peças e etapas. Ou seja, pode-se registrar tempo para uma peça e etapa por vez, ou pode-se trabalhar em peças e etapas ao mesmo tempo.

O sistema deverá exibir o preço base (calculado pelo valor unitário das peças * quantidade), custo estimado (calculado através do valor/hora dos tempos adicionados * recursos utilizados),  com base nos recursos e tempos adicionados.

Grades de roupas devem ser consideradas como peças a mais, aumentando a quantidade da peça.

O sistema deverá exibir as opções "Salvar", "Salvar e concluir serviço", "Serviço pago", "Reabrir", "Retorno de serviço".

* "Salvar e concluir serviço": Salvar e coloca o status do serviço como concluído. Ao abrir o serviço novamente, os dados estarão somente leitura, menos para a opção de adicionar pagamentos.
* "Serviço pago": Adiciona o status pago ao serviço, não permitindo mais a sua edição. Essa opção deve ser exibida apenas quando o serviço está concluído.
* "Reabrir": Adiciona o status "em andamento" ao serviço, permitindo novamente a sua edição. Essa opção deve ser exibida apenas quando o serviço está concluído ou pago. Deve ser usada para correção de algum erro de registro.
* "Retorno de serviço": Adiciona o status "em andamento" ao serviço, e flag de serviço com retorno. O sistema deverá permitir apenas a adição de novas peças/etapas/recuros, e inclusão de tempo apenas nessas peças. Essa opção deve ser utilizada quando um trabalho entregue é retornado em outro dia para um novo ajuste/correção. Essa opção deve ser exibida apenas quando o serviço está em status "concluído" ou "pago".

### 7. Controle de receitas e despesas
Listagem de receitas e despesas, inclusão, alteração e exclusão. Filtros: Período, cliente, tipo, situação (todos, ativos, excluídos).

* No cadastro, exibir opção para indicar Receita ou Despesa.
    * Se receita:
        * Valor
        * Forma de pagamento
        * Descrição
        *  Valor líquido**
        * Gerado automaticamente (sim/não)
        * Serviço referente
    * Se despesa:
        * Valor
        * Descrição
        * Gerado automaticamente (sim/não)
        * Serviço referente

** Calculado pelo sistema. Quando a receita for um pagamento com cartão de crédito, o sistema deverá exibir o valor "líquido", ou seja, descontado a taxa padrão

As receitas/despesas adicionadas nos serviços também serão listadas por aqui.

### 8. Controle de Receitas e despesas recorrentes

Listagem de receitas e despesas, inclusão, alteração e exclusão. Filtros: Período, cliente, tipo, situação (todos, ativos, excluídos).

* No cadastro, exibir opção para indicar Receita ou Despesa.
    * Se receita:
        * Valor, Forma de pagamento, Descrição, Valor líquido**, dia base
    * Se despesa:
        * Valor, Descrição, dia base

### 9. Relatórios

* Relatório de fluxo de caixa, por período, com totalização por mês/ano. O sistema listará as entradas e saídas, com saldo final.
* Relatório de custos de produção por período. O sistema listará todos os serviços realizados no período, fazendo um de-para de valor estimado, custo calculado, pago, 
horas estimadas com horas realizadas, geral e por etapa. 

### 10. Parâmetros

* Valor/hora padrão
* Taxa de forma de pagamento crédito padrão
