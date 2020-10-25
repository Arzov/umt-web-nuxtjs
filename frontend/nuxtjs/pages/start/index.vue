<template>
  <div>
    <a-row type="flex" justify="space-around" align="middle">
      <a-col :span="12">
        <ThemeToggle />
        <Logo />
      </a-col>
      <a-col :span="12">
        <h1>Inicio de sesión</h1>
        <b>¿Olvidaste tu contraseña?</b> <nuxt-link to="/">
          Recupérala.
        </nuxt-link>
        <br>
        - O ingresa con tus redes sociales -
        <GoogleLogin />
        <FacebookLogin />
        <b>No tienes cuenta?</b> <nuxt-link to="/">
          Regístrate.
        </nuxt-link>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import GoogleLogin from '@/components/google'
import FacebookLogin from '@/components/facebook'
import ThemeToggle from '@/components/themeToggle'

export default {
  layout: ({ isMobile }) => isMobile ? 'mobile' : 'default',
  components: { GoogleLogin, FacebookLogin, ThemeToggle }
}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family:
    'Quicksand',
    'Source Sans Pro',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial,
    sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
