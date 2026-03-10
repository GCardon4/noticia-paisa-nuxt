<template>
  <q-page class="flex flex-center bg-grey-2">
    <q-card class="login-card q-pa-md" style="width: 100%; max-width: 400px;">
      <q-card-section class="text-center">
        <div class="text-h4 text-weight-bold text-primary q-mb-md">
          Noticia Paisa
        </div>
        <div class="text-subtitle1 text-grey-7">
          Iniciar Sesión
        </div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="handleLogin" class="q-gutter-md">
          <!-- Campo de correo electrónico -->
          <q-input
            v-model="email"
            type="email"
            label="Correo electrónico"
            outlined
            dense
            :rules="[val => !!val || 'El correo es requerido', val => isValidEmail(val) || 'Correo inválido']"
            lazy-rules
          >
            <template v-slot:prepend>
              <q-icon name="email" />
            </template>
          </q-input>

          <!-- Campo de contraseña -->
          <q-input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            label="Contraseña"
            outlined
            dense
            :rules="[val => !!val || 'La contraseña es requerida', val => val.length >= 6 || 'Mínimo 6 caracteres']"
            lazy-rules
          >
            <template v-slot:prepend>
              <q-icon name="lock" />
            </template>
            <template v-slot:append>
              <q-icon
                :name="showPassword ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="showPassword = !showPassword"
              />
            </template>
          </q-input>

          <!-- Mensaje de error -->
          <q-banner v-if="authStore.error" class="bg-negative text-white rounded-borders" dense>
            <template v-slot:avatar>
              <q-icon name="error" color="white" />
            </template>
            {{ authStore.error }}
          </q-banner>

          <!-- Botón de inicio de sesión -->
          <q-btn
            type="submit"
            label="Iniciar Sesión"
            color="primary"
            class="full-width"
            :loading="authStore.loading"
            :disable="authStore.loading"
            unelevated
          />
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from 'src/stores/authStore'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const authStore = useAuthStore()
const router = useRouter()
const $q = useQuasar()

// Estado del formulario
const email = ref('')
const password = ref('')
const showPassword = ref(false)

// Valida el formato del correo electrónico
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Maneja el inicio de sesión
const handleLogin = async () => {
  const result = await authStore.login(email.value, password.value)
  
  if (result.success) {
    $q.notify({
      type: 'positive',
      message: 'Sesión iniciada correctamente',
      position: 'top'
    })
    
    // Redirige a la página de crear post
    router.push('/crear-post')
  } else {
    $q.notify({
      type: 'negative',
      message: result.error || 'Error al iniciar sesión',
      position: 'top'
    })
  }
}
</script>

<style scoped lang="scss">
.login-card {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
}
</style>
