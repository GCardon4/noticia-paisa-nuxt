<template>
  <q-page class="constrain q-pa-md">
    <div class="row justify-center">
      <div class="col-12 col-md-10 col-lg-8">
        <!-- Encabezado -->
        <div class="text-center q-mb-xl">
          <h1 class="text-h3 text-weight-bold q-mb-md">Contáctanos</h1>
          <p class="text-h6 text-grey-7">
            Estamos aquí para mantenerte informado con las mejores noticias de la región
          </p>
        </div>

        <div class="row q-col-gutter-lg">
          <!-- Información de contacto -->
          <div class="col-12 col-md-6">
            <q-card flat bordered class="full-height">
              <q-card-section>
                <div class="text-h5 text-weight-bold q-mb-md">
                  <q-icon name="info" color="primary" size="sm" class="q-mr-sm" />
                  Sobre Noticia Paisa
                </div>
                <p class="text-body1 text-grey-8">
                  Somos un medio digital comprometido con llevar información veraz,
                  oportuna y relevante sobre los acontecimientos más importantes de nuestra región.
                </p>
                <p class="text-body1 text-grey-8">
                  ¿Tienes una noticia que compartir? ¿Quieres colaborar con nosotros?
                  ¡Contáctanos a través de nuestros canales!
                </p>
              </q-card-section>

              <q-separator />

              <q-card-section>
                <div class="text-h6 text-weight-bold q-mb-md">Nuestras Redes Sociales</div>
                <q-list>
                  <q-item
                    v-for="red in redesSociales"
                    :key="red.nombre"
                    clickable
                    tag="a"
                    :href="red.url"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <q-item-section avatar>
                      <q-avatar size="40px" :class="`social-avatar ${red.bgColor}`">
                        <img :src="red.icon" :alt="red.nombre" class="social-icon-contact"/>
                      </q-avatar>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ red.nombre }}</q-item-label>
                      <q-item-label caption>{{ red.handle }}</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-icon name="open_in_new" color="grey-6" />
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
            </q-card>
          </div>

          <!-- Tarjetas de acción -->
          <div class="col-12 col-md-6">
            <q-card flat bordered class="bg-primary text-white q-mb-lg">
              <q-card-section>
                <div class="text-h5 text-weight-bold q-mb-md">
                  <q-icon name="campaign" size="sm" class="q-mr-sm" />
                  ¿Tienes una noticia?
                </div>
                <p class="text-body1">
                  Si tienes información relevante que crees que debemos cubrir,
                  no dudes en contactarnos por WhatsApp.
                </p>
                <q-btn
                  unelevated
                  color="white"
                  text-color="primary"
                  label="Enviar WhatsApp"
                  icon="whatsapp"
                  class="full-width"
                  href="https://wa.me/+573153459039?text=Hola%20Noticia%20Paisa,%20tengo%20información%20para%20compartir"
                  target="_blank"
                  size="lg"
                />
              </q-card-section>
            </q-card>

            <q-card flat bordered>
              <q-card-section>
                <div class="text-h5 text-weight-bold q-mb-md">
                  <q-icon name="schedule" color="primary" size="sm" class="q-mr-sm" />
                  Horario de Atención
                </div>
                <q-list>
                  <q-item>
                    <q-item-section avatar><q-icon name="today" color="primary" /></q-item-section>
                    <q-item-section>
                      <q-item-label>Lunes a Viernes</q-item-label>
                      <q-item-label caption>8:00 AM - 6:00 PM</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section avatar><q-icon name="weekend" color="primary" /></q-item-section>
                    <q-item-section>
                      <q-item-label>Sábados</q-item-label>
                      <q-item-label caption>9:00 AM - 2:00 PM</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section avatar><q-icon name="notifications_active" color="orange" /></q-item-section>
                    <q-item-section>
                      <q-item-label>Noticias de última hora</q-item-label>
                      <q-item-label caption>24/7 en redes sociales</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
            </q-card>
          </div>
        </div>

        <!-- Mensaje final -->
        <div class="text-center q-mt-xl q-pa-lg bg-grey-2 rounded-borders">
          <q-icon name="favorite" color="red-6" size="48px" class="q-mb-md" />
          <p class="text-h6 text-grey-8">
            Gracias por confiar en Noticia Paisa para mantenerte informado
          </p>
          <p class="text-body2 text-grey-7">Siempre Actualizados, siempre contigo</p>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
useSeoMeta({
  title: 'Contacto — Noticia Paisa',
  description: 'Contáctanos para enviar noticias, colaborar o seguirnos en redes sociales.',
})

const redesSociales = [
  { nombre: 'Facebook', handle: '@noticiapaisa', url: 'https://www.facebook.com/groups/835338216798589/user/61565454885470', icon: '/social-icons/icon-facebook-white.svg', bgColor: 'bg-blue-6' },
  { nombre: 'Instagram', handle: '@noticiapaisaoficial', url: 'https://www.instagram.com/noticiapaisaoficial/', icon: '/social-icons/icon-instagram-white.svg', bgColor: 'bg-pink-6' },
  { nombre: 'YouTube', handle: '@noticiapaisa', url: 'https://www.youtube.com/@noticiapaisa', icon: '/social-icons/icon-youtube-white.svg', bgColor: 'bg-red-6' },
  { nombre: 'Telegram', handle: '@noticiapaisaoficial1', url: 'https://t.me/noticiapaisaoficial1', icon: '/social-icons/icon-telegram-white.svg', bgColor: 'bg-blue-4' },
  { nombre: 'TikTok', handle: '@noticiapaisaoficial', url: 'https://www.tiktok.com/@noticiapaisaoficial', icon: '/social-icons/icon-tiktok-white.svg', bgColor: 'bg-grey-9' },
  { nombre: 'WhatsApp', handle: '+57 315 345 9039', url: 'https://wa.me/+573153459039', icon: '/social-icons/icon-whatsapp-white.svg', bgColor: 'bg-green-6' },
]
</script>

<style scoped>
.social-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
}

.social-icon-contact {
  width: 24px;
  height: 24px;
  object-fit: contain;
}
</style>
