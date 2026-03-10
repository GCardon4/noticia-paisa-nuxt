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
                  Nuestro equipo trabaja día a día para mantenerlos siempre actualizados.
                </p>
                <p class="text-body1 text-grey-8">
                  ¿Tienes una noticia que compartir? ¿Quieres colaborar con nosotros? 
                  ¡Contáctanos a través de nuestros canales!
                </p>
              </q-card-section>

              <q-separator />

              <q-card-section>
                <div class="text-h6 text-weight-bold q-mb-md">Nuestras Redes Sociales</div>
                
                <!-- Redes sociales como lista -->
                <q-list>
                  <q-item 
                    clickable 
                    tag="a" 
                    href="https://www.facebook.com/noticiapaisa/" 
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <q-item-section avatar>
                      <q-avatar size="40px" class="social-avatar bg-blue-6">
                        <img src="/social-icons/icon-facebook-white.svg" alt="Facebook" class="social-icon-contact"/>
                      </q-avatar>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>Facebook</q-item-label>
                      <q-item-label caption>@noticiapaisa</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-icon name="open_in_new" color="grey-6" />
                    </q-item-section>
                  </q-item>

                  <q-item 
                    clickable 
                    tag="a" 
                    href="https://www.instagram.com/noticiapaisaoficial/" 
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <q-item-section avatar>
                      <q-avatar size="40px" class="social-avatar bg-pink-6">
                        <img src="/social-icons/icon-instagram-white.svg" alt="Instagram" class="social-icon-contact"/>
                      </q-avatar>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>Instagram</q-item-label>
                      <q-item-label caption>@noticiapaisaoficial</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-icon name="open_in_new" color="grey-6" />
                    </q-item-section>
                  </q-item>

                  <q-item 
                    clickable 
                    tag="a" 
                    href="https://www.youtube.com/@noticiapaisa" 
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <q-item-section avatar>
                      <q-avatar size="40px" class="social-avatar bg-red-6">
                        <img src="/social-icons/icon-youtube-white.svg" alt="YouTube" class="social-icon-contact"/>
                      </q-avatar>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>YouTube</q-item-label>
                      <q-item-label caption>@noticiapaisa</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-icon name="open_in_new" color="grey-6" />
                    </q-item-section>
                  </q-item>

                  <q-item 
                    clickable 
                    tag="a" 
                    href="https://t.me/noticiapaisaoficial1" 
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <q-item-section avatar>
                      <q-avatar size="40px" class="social-avatar bg-red-6">
                        <img src="/social-icons/icon-telegram.svg" alt="Telegram" class="social-icon-contact"/>
                      </q-avatar>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>Telegram</q-item-label>
                      <q-item-label caption>@noticiapaisaoficial1</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-icon name="open_in_new" color="grey-6" />
                    </q-item-section>
                  </q-item>


                  <q-item 
                    clickable 
                    tag="a" 
                    href="https://www.tiktok.com/@noticiapaisaoficial?_r=1&_t=ZS-91kdnJqpYIe" 
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <q-item-section avatar>
                      <q-avatar size="40px" class="social-avatar bg-red-6">
                        <img src="/social-icons/icon-tiktok.svg" alt="Tik Tok" class="social-icon-contact"/>
                      </q-avatar>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>Tik Tok</q-item-label>
                      <q-item-label caption>@noticiapaisaoficial</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-icon name="open_in_new" color="grey-6" />
                    </q-item-section>
                  </q-item>

                  <q-item 
                    clickable 
                    tag="a" 
                    href="https://wa.me/+573153459039" 
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <q-item-section avatar>
                      <q-avatar size="40px" class="social-avatar bg-green-6">
                        <img src="/social-icons/icon-whatsapp-white.svg" alt="WhatsApp" class="social-icon-contact"/>
                      </q-avatar>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>WhatsApp</q-item-label>
                      <q-item-label caption>+57 315 345 9039</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-icon name="open_in_new" color="grey-6" />
                    </q-item-section>
                  </q-item>


                </q-list>
              </q-card-section>
            </q-card>
          </div>

          <!-- Tarjeta de llamado a la acción -->
          <div class="col-12 col-md-6">
            <q-card flat bordered class="bg-primary text-white q-mb-lg">
              <q-card-section>
                <div class="text-h5 text-weight-bold q-mb-md">
                  <q-icon name="campaign" size="sm" class="q-mr-sm" />
                  ¿Tienes una noticia?
                </div>
                <p class="text-body1">
                  Si tienes información relevante que crees que debemos cubrir, 
                  no dudes en contactarnos por WhatsApp. Valoramos tu participación 
                  en mantener a la comunidad informada.
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
                    <q-item-section avatar>
                      <q-icon name="today" color="primary" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>Lunes a Viernes</q-item-label>
                      <q-item-label caption>8:00 AM - 6:00 PM</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section avatar>
                      <q-icon name="weekend" color="primary" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>Sábados</q-item-label>
                      <q-item-label caption>9:00 AM - 2:00 PM</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section avatar>
                      <q-icon name="notifications_active" color="orange" />
                    </q-item-section>
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
          <p class="text-body2 text-grey-7">
            Siempre Actualizados, siempre contigo
          </p>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
// Página de contacto de Noticia Paisa
</script>

<style scoped lang="scss">
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
