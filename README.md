# :pushpin: Planora
**Planora** é um aplicativo web desenvolvido para simular diferentes disposições de produtos em espaços comerciais, auxiliando no estudo e análise da eficiência do layout de loja. Como projeto acadêmico, o sistema permite desenhar um layout de loja interativo em um canvas, posicionando elementos como mesas (desks), estantes (shelves), portas e janelas. O objetivo é avaliar a experiência do cliente e facilitar a otimização dos espaços de varejo por meio de diferentes arranjos de produtos.

### Objetivos
- Explorar conceitos de experiência do usuário e otimização de espaços comerciais.
- Aplicar conhecimentos de desenvolvimento web na construção de um sistema interativo.
- Facilitar a simulação e análise de diferentes disposições de produtos no varejo.

### Tecnologias Utilizadas
- **HTML:** Estrutura da página e marcação dos elementos da interface.
- **CSS:** Estilização visual dos componentes e layout do aplicativo.
- **JavaScript (puro):** Lógica de interação, manipulação do canvas e salvamento de dados. Não foram utilizados frameworks ou bibliotecas externas.

## Funcionalidades Principais
- Desenho em canvas com snapping e magnetismo: permite traçar paredes e posicionar elementos seguindo uma grade. Os objetos "grudam" aos vértices mais próximos, garantindo precisão no layout.
- Interface com botões de categorias: há botões alternáveis para selecionar categorias de itens (Desks, Shelves, Windows, Doors, Varied). Ao selecionar uma categoria, o usuário pode desenhar esse tipo de elemento na planta da loja.
- Salvamento de layouts em JSON: o projeto oferece a exportação do layout criado como arquivo JSON, facilitando o compartilhamento e análise externa dos dados.
- AutoSave automático: o sistema salva automaticamente o layout atual em intervalos regulares (a cada 5 minutos), prevenindo perda de dados em caso de quedas ou fechamentos acidentais.
- Interface interativa de simulação de loja: ambiente visual que simula uma loja real, permitindo experimentar diferentes configurações de prateleiras, mesas e outros elementos. Isso ajuda a avaliar o impacto de cada layout no fluxo de clientes e operação da loja.

### Como executar localmente
1. Clone este repositório em sua máquina local:
```
git clone https://github.com/Marichoii/Planora.git
```
2. Navegue até o diretório do projeto:
```
cd Planora
```
3. Abra o arquivo index.html em seu navegador favorito (por exemplo, arrastando-o para o navegador ou dando duplo clique). Isso carregará a interface do Planora para uso local.
> Dica: Por tratar-se de um projeto apenas com HTML, CSS e JavaScript, não é necessário configurar um servidor web. Contudo, se você encontrar problemas de permissão ao abrir localmente, pode servir os arquivos usando ferramentas simples (como a extensão Live Server do VSCode) para garantir que todos os recursos sejam carregados corretamente.

## Licença
Este projeto está licenciado sob a MIT License. Veja o arquivo [LICENSE](LICENSE/). para obter mais detalhes.
