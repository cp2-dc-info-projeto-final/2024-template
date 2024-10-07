<script>
    // import { onMount } from 'svelte';
    import axios from "axios";
    let email = "";
    let senha = "";
    let error = null;
    let resultado = null;

    const api_base_url = "http://localhost:3000";
  
  
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
  </main>
  