<script>
  import { onMount } from 'svelte';
  import axios from "axios";
  let nome = "";
  let email = "";
  let senha = "";
  let conf_senha = "";
  let error = null;
  let resultado = null;
  let usuarios = null;
  let usuarioLogado = null;
  let colunasUsuarios = null;

  const API_BASE_URL = "http://localhost:3000";

  // habilita envio das credenciais via cookies em toda requisição axios
  // também configura a base URL padrão para todos os requests usando essa instância
  const axiosInstance = axios.create({
    withCredentials: true,
    baseURL: API_BASE_URL,
    responseType: "json",
    headers: {
          Accept: "application/json",
      }
  });

  const getDataHelloWorld = async () => {
    try {
      let res = await axiosInstance.get("/hello");
      resultado = res.data;
      error = null; // Limpa o erro se a requisição for bem-sucedida
    } catch (err) {
      error = "Erro ao buscar dados: " + err.response?.data?.message || err.message;
      console.error(err);
      resultado = null; // Limpa o resultado em caso de erro
    }
  };

  const carregarUsuarios = async () => {
    try {
      let res = await axiosInstance.get("/usuarios");
      usuarios = res.data.usuarios;
      colunasUsuarios = Object.keys(usuarios[0]);
      error = null; // Limpa o erro se a requisição for bem-sucedida
    } catch (err) {
      error = "Erro ao buscar dados: " + err.response?.data?.message || err.message;;
      console.error(err);
      usuarios = null; // Limpa o resultado em caso de erro
    }
  };

  const cadastrarUsuario = async () => {
    try {
      let res = await axiosInstance.post("/usuarios/novo",
        {
          nome,
          email,
          senha,
          conf_senha,
        }
      );
      resultado = res.data;
      error = null; // Limpa o erro se a requisição for bem-sucedida
      // recarrega lista de usuários apresentada
      carregarUsuarios();
    } catch (err) {
      error =
        "Erro ao enviar dados: " + err.response?.data?.message || err.message;
      resultado = null; // Limpa o resultado em caso de erro
    }
    
  };

  const buscarUsuarioLogado = async () => {
        try {
            const res = await axiosInstance.get('/usuarios/me');
            console.log(res.data);
            usuarioLogado = res.data.usuario; // Armazena os dados do usuário
            error = null; // Limpa o erro se a requisição for bem-sucedida
        } catch (err) {
            error = err.response?.data?.message || err.message;
            usuarioLogado = null; // Limpa os dados em caso de erro
        }
    };


  // Função para deletar o usuário pelo ID
  const deletarUsuario = async (id) => {
    try {
      let res = await axiosInstance.delete(`/usuarios/${id}`);
      resultado = res.data;
      error = null;
      // recarrega lista de usuários apresentada
      carregarUsuarios();
    } catch (err) {
      error =
        "Erro ao deletar usuário: " +
        (err.response?.data?.message || err.message);
      resultado = null;
    }
  };

  
  // Busca os dados do usuário logado e lista dos usuários quando o componente é inicializado
  onMount(() => {
    buscarUsuarioLogado();
    carregarUsuarios();
  }); 

</script>

<main>
  <div class="card">
    {#if error}
        <p style="color: red;">{error}</p>
    {:else if usuarioLogado}
        <h2>Dados do Usuário Logado</h2>
      
        <p><strong>ID:</strong> {usuarioLogado.idUsuario}</p>
        <p><strong>Nome:</strong> {usuarioLogado.nome}</p>
        <p><strong>E-mail:</strong> {usuarioLogado.email}</p>
      
    {:else}
        <p>Carregando dados do usuário...</p>
    {/if}
</div>
  <div class="card">
    <button on:click={getDataHelloWorld}>Hello svelte!</button>
    {#if error}
      <p style="color: red;">{error}</p>
    {/if}
    {#if resultado && resultado.texto_completo}
      <p>{resultado.texto_completo}</p>
      <p></p>{/if}
  </div>
  <div class="card">
    <div class="formulario">
      <h2>Cadastrar Usuário</h2>
      <form on:submit|preventDefault={cadastrarUsuario}>
        <div>
          <label for="nome">Nome:</label>
          <input
            type="text"
            id="nome"
            bind:value={nome}
            placeholder="Digite o nome"
            required
          />
        </div>
        <div>
          <label for="email">Email:</label>
          <input
            type="email"
            id="email"
            bind:value={email}
            placeholder="Digite o email"
            required
          />
        </div>
        <div>
          <label for="senha">Senha:</label>
          <input
            type="password"
            id="senha"
            bind:value={senha}
            placeholder="Digite a senha"
            required
          />
        </div>
        <div>
          <label for="conf_senha">Confirme a Senha:</label>
          <input
            type="password"
            id="conf_senha"
            bind:value={conf_senha}
            placeholder="Confirme a senha"
            required
          />
        </div>
        <div>
          <button type="submit">Cadastrar</button>
        </div>
      </form>

      {#if error}
        <p style="color: red;">{error}</p>
      {/if}
      {#if resultado && resultado.message}
        <p style="color: green;">{resultado.message}</p>
      {/if}
    </div>
  </div>
  <div class="card">
    {#if usuarios}
      <table>
        <thead>
          <tr>
            {#each colunasUsuarios as nome_coluna}
              <th>{nome_coluna}</th>
            {/each}
            <th></th>
          </tr><tr />
        </thead>
        <tbody>
          {#each Object.values(usuarios) as linha_usuario}
            <tr>
              {#each colunasUsuarios as atributo}
                <td>{linha_usuario[atributo]}</td>
              {/each}
              <td>
                <button on:click={() => deletarUsuario(linha_usuario.id_usuario)}>Remover</button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
  </div>
</main>
