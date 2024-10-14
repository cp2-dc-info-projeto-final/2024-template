<script>
    // import { onMount } from 'svelte';
    import axios from "axios";
    let email = "";
    let senha = "";
    let error = null;
    let resultado = null;

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
    
    const loginUsuario = async () => {
      try {
        let res = await axiosInstance.post("/login",
          {
            email,
            senha
          }
        );

        resultado = res.data;

        // Redirecionar para uma página protegida após login bem-sucedido
        if (resultado && resultado.status === "success") { 
            window.location.href = "/index.html";  
        }
        error = null; // Limpa o erro se a requisição for bem-sucedida
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
  