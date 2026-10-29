# MAIA Design · Landing page

Site estático (um único `index.html`), pronto para o GitHub Pages.

## Como publicar (sem usar terminal)
1. No GitHub, clique em **New repository**, dê um nome (ex.: `maia-site`) e deixe **Public**.
2. Em **Add file → Upload files**, envie **todo o conteúdo desta pasta** (`index.html`, `.nojekyll`, `capas/`, `worker/`, `README.md`) e clique em **Commit changes**.
3. Vá em **Settings → Pages**. Em **Build and deployment**, escolha **Deploy from a branch**, branch **main**, pasta **/ (root)**, e salve.
4. Em 1 a 2 minutos o site aparece em `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/`.
5. Para usar o domínio `studiomaia.com.br`: em **Settings → Pages → Custom domain**, informe o domínio e siga as instruções de DNS que o GitHub mostrar.

## Configurações (topo do `<script>` no `index.html`, objeto `MAIA`)
- `whatsapp`: número com DDI e DDD, para ativar o botão de WhatsApp.
- `email` ou `endpoint`: o GitHub Pages não recebe formulários. Informe o e-mail para envio por mailto ou o endereço de um serviço de formulários (ex.: Formspree).
- `capas`: se as capas do Behance não carregarem, baixe as imagens, salve em `capas/` com o número do projeto como nome (ex.: `241257367.jpg`) e escreva `"capas"` neste campo.
- `behance.feed`: endereço do Worker (opcional, pasta `worker/`) para leitura mais estável do Behance.

## Atualização automática dos trabalhos
A página lê o perfil https://www.behance.net/saracaslowdesigner a cada visita e troca a lista pelos projetos mais recentes. Se a leitura falhar, mostra a lista embutida no código.
