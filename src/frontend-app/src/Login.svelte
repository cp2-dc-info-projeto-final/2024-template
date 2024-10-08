<script>
    // import { onMount } from 'svelte';
    import axios from "axios";
    let email = "";
    let senha = "";
    let error = null;
    let resultado = null;
    let usuarios = null;
    let colunas_usuarios = null;

    const api_base_url = "http://localhost:3000";
  
    const carregarUsuarios = async () => {
      try {
        let res = await axios.get(api_base_url + "/usuarios", {
          responseType: "json",
          headers: {
            Accept: "application/json",
          },
        });
        usuarios = res.data.usuarios;
        colunas_usuarios = Object.keys(usuarios[0]);
        error = null; // Limpa o erro se a requisição for bem-sucedida
      } catch (err) {
        error = "Erro ao buscar dados: " + err.response?.data?.message || err.message;;
        console.error(err);
        usuarios = null; // Limpa o resultado em caso de erro
      }
    };

  
    const loginUsuario = async () => {
      try {
        let res = await axios.post(
          api_base_url + "/login",
          {
            email,
            senha
          },
          {
            headers: {
              Accept: "application/json",
            },
          },
        );
        resultado = res.data;
        error = null; // Limpa o erro se a requisição for bem-sucedida
        // recarrega lista de usuários apresentada
      } catch (err) {
        error = err.response?.data?.message || err.message;
        resultado = null; // Limpa o resultado em caso de erro
      }
      
    };
  
    carregarUsuarios()
  </script>
  

<main>
    <div class="card">
      <div class="formulario">

        <form on:submit|preventDefault={loginUsuario}>
          
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
          {#if error}
                <p style="color: red;">{error}</p>
            {/if}
            {#if resultado && resultado.message}
                <p style="color: green;">{resultado.message}</p>
            {/if}
          <div>
            <button type="submit">Login</button>
          </div>
        </form>
    </div>

    <div class="card">
      {#if usuarios}
        <table>
          <thead>
            <tr>
              {#each colunas_usuarios as nome_coluna}
                <th>{nome_coluna}</th>
              {/each}
              <th></th>
            </tr><tr />
          </thead>
          <tbody>
            {#each Object.values(usuarios) as linha_usuario}
              <tr>
                {#each colunas_usuarios as atributo}
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
  