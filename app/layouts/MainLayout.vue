<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" class="lt-md" />

        <q-toolbar-title> Noticia Paisa </q-toolbar-title>

        <!-- Enlaces de navegación en desktop -->
        <div class="gt-sm">
          <q-btn flat label="Noticias" @click="goTo('/')" />
          <q-btn flat label="Quiénes Somos" @click="goTo('/quienes-somos')" />
          <q-btn flat label="Contacto" @click="goTo('/contacto')" />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Navegación </q-item-label>

        <!-- Enlaces para usuarios autenticados -->
        <template v-if="authStore.isAuthenticated()">
          <q-item clickable v-ripple @click="goTo('/')">
            <q-item-section avatar>
              <q-icon name="home" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Noticias</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple @click="goTo('/quienes-somos')">
            <q-item-section avatar>
              <q-icon name="info" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Quiénes Somos</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple @click="goTo('/contacto')">
            <q-item-section avatar>
              <q-icon name="mail" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Contacto</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator />

          <q-item clickable v-ripple @click="goTo('/crear-post')">
            <q-item-section avatar>
              <q-icon name="add_circle" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Crear Post</q-item-label>
              <q-item-label caption>Solo Admin</q-item-label>
            </q-item-section>
          </q-item>
        </template>

        <!-- Enlaces para usuarios no autenticados -->
        <template v-else>
          <q-item clickable v-ripple @click="goTo('/')">
            <q-item-section avatar>
              <q-icon name="home" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Noticias</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple @click="goTo('/quienes-somos')">
            <q-item-section avatar>
              <q-icon name="info" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Quiénes Somos</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple @click="goTo('/contacto')">
            <q-item-section avatar>
              <q-icon name="phone" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Contacto</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator />

          <q-item clickable v-ripple @click="goTo('/login')">
            <q-item-section avatar>
              <q-icon name="login" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Iniciar Sesión</q-item-label>
            </q-item-section>
          </q-item>
        </template>
      </q-list>
    </q-drawer>

    <q-page-container>
      <NuxtPage />
    </q-page-container>

    <q-footer class="bg-primary text-white">
      <div class="footer-content q-pa-md">
        <div class="row items-center justify-between">

          
          <!-- Redes sociales -->
          <div class="col-12 col-md-6 text-center text-md-right">
            <div class="text-caption q-mb-sm">Síguenos en redes sociales</div>
            <div class="social-links">
              <a 
                href="https://www.facebook.com/noticiapaisa/" 
                target="_blank" 
                rel="noopener noreferrer"
                class="social-link"
              >
                <img src="/social-icons/icon-facebook-white.svg" alt="Facebook" class="footer-icon"/>
              </a>

              <a 
                href="https://www.instagram.com/noticiapaisaoficial/" 
                target="_blank" 
                rel="noopener noreferrer"
                class="social-link"
              >
                <img src="/social-icons/icon-instagram-white.svg" alt="Instagram" class="footer-icon"/>
              </a>
              <a 
                href="https://www.youtube.com/@noticiapaisa" 
                target="_blank" 
                rel="noopener noreferrer"
                class="social-link"
              >
                <img src="/social-icons/icon-youtube-white.svg" alt="YouTube" class="footer-icon"/>
              </a>

              <a 
                href="https://www.tiktok.com/@noticiapaisaoficial?_r=1&_t=ZS-91kdnJqpYIe" 
                target="_blank" 
                rel="noopener noreferrer"
                class="social-link"
              >
                <img src="/social-icons/icon-tiktok-white.svg" alt="TikTok" class="footer-icon"/>
              </a>
              <a 
                href="https://t.me/noticiapaisaoficial1" 
                target="_blank" 
                rel="noopener noreferrer"
                class="social-link"
              >
                <img src="/social-icons/icon-telegram-white.svg" alt="Telegram" class="footer-icon"/>
              </a>
              <a 
                href="https://wa.me/+573153459039" 
                target="_blank" 
                rel="noopener noreferrer"
                class="social-link"
              >
                <img src="/social-icons/icon-whatsapp-white.svg" alt="WhatsApp" class="footer-icon"/>
              </a>
            </div>
          </div>
        </div>

        <!-- Copyright -->
        <div class="row q-mt-md">
          <div class="col-12 text-center">
            <q-separator class="q-mb-sm" color="white" style="opacity: 0.3" />
            <div class="text-caption">
              © {{ currentYear }} Noticia Paisa. Todos los derechos reservados.
            </div>
          </div>
        </div>
      </div>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '~/stores/authStore'

const authStore = useAuthStore()

const leftDrawerOpen = ref(false)

const currentYear = computed(() => new Date().getFullYear())

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

function goTo(path) {
  navigateTo(path)
  leftDrawerOpen.value = false
}
</script>

<style scoped>
.footer-content {
  max-width: 1200px;
  margin: 0 auto;
}

.social-links {
  display: flex;
  gap: 16px;
  justify-content: center;
  align-items: center;
}

@media (min-width: 768px) {
  .social-links {
    justify-content: flex-end;
  }
}

.social-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.social-link:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-3px);
}

.footer-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
}
</style>