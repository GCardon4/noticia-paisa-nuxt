<template>
  <q-page class="constrain q-pa-md">
    <div class="row justify-center">
      <div class="col-12 col-md-10 col-lg-8">
        <!-- Encabezado -->
        <div class="text-center q-mb-xl q-pt-md">
          <q-avatar size="120px" class="q-mb-md">
            <img src="https://aicjdmlphcozkmdsjraf.supabase.co/storage/v1/object/public/avatars/logotipo-noticiapaisa.jpg" alt="Noticia Paisa"/>
          </q-avatar>
          <h1 class="text-h3 text-weight-bold q-mb-md">Noticia Paisa</h1>
          <p class="text-h5 text-primary">Siempre Actualizados</p>
        </div>

        <!-- Quiénes somos -->
        <q-card flat bordered class="q-mb-lg">
          <q-card-section>
            <div class="text-h4 text-weight-bold q-mb-md">
              <q-icon name="groups" color="primary" size="md" class="q-mr-sm" />
              ¿Quiénes Somos?
            </div>
            <p class="text-body1 text-grey-8 q-mb-md">
              Noticia Paisa es un medio digital comprometido con la información 
              veraz, oportuna y relevante para nuestra comunidad. Nacimos con el 
              propósito de mantener a nuestra región siempre informada sobre los 
              acontecimientos más importantes que afectan el día a día de los paisas.
            </p>
            <p class="text-body1 text-grey-8">
              Nuestro equipo está conformado por profesionales apasionados por el 
              periodismo y la comunicación, que trabajan incansablemente para traerte 
              las noticias que realmente importan, desde lo local hasta lo regional, 
              siempre con un enfoque cercano y comprometido con la verdad.
            </p>
          </q-card-section>
        </q-card>

        <!-- Nuestra misión y visión -->
        <div class="row q-col-gutter-md q-mb-lg">
          <div class="col-12 col-md-6">
            <q-card flat bordered class="full-height">
              <q-card-section class="bg-primary text-white">
                <div class="text-h5 text-weight-bold">
                  <q-icon name="flag" size="sm" class="q-mr-sm" />
                  Nuestra Misión
                </div>
              </q-card-section>
              <q-card-section>
                <p class="text-body1 text-grey-8">
                  Informar a la comunidad paisa con noticias verificadas, 
                  oportunas y relevantes, promoviendo la participación ciudadana 
                  y el desarrollo de nuestra región a través de un periodismo 
                  responsable y de calidad.
                </p>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 col-md-6">
            <q-card flat bordered class="full-height">
              <q-card-section class="bg-secondary text-white">
                <div class="text-h5 text-weight-bold">
                  <q-icon name="visibility" size="sm" class="q-mr-sm" />
                  Nuestra Visión
                </div>
              </q-card-section>
              <q-card-section>
                <p class="text-body1 text-grey-8">
                  Ser el medio digital de referencia en la región, reconocido 
                  por nuestra credibilidad, innovación y compromiso con la 
                  comunidad, siendo el puente de comunicación entre los ciudadanos 
                  y los acontecimientos que moldean nuestra sociedad.
                </p>
              </q-card-section>
            </q-card>
          </div>
        </div>

        <!-- Nuestros valores -->
        <q-card flat bordered class="q-mb-lg">
          <q-card-section>
            <div class="text-h4 text-weight-bold q-mb-md">
              <q-icon name="star" color="primary" size="md" class="q-mr-sm" />
              Nuestros Valores
            </div>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-sm-6 col-md-4">
                <div class="value-item">
                  <q-icon name="verified" color="primary" size="48px" class="q-mb-sm" />
                  <div class="text-h6 text-weight-bold q-mb-xs">Veracidad</div>
                  <p class="text-body2 text-grey-7">
                    Verificamos cada noticia antes de publicarla
                  </p>
                </div>
              </div>
              <div class="col-12 col-sm-6 col-md-4">
                <div class="value-item">
                  <q-icon name="speed" color="primary" size="48px" class="q-mb-sm" />
                  <div class="text-h6 text-weight-bold q-mb-xs">Oportunidad</div>
                  <p class="text-body2 text-grey-7">
                    Información cuando la necesitas
                  </p>
                </div>
              </div>
              <div class="col-12 col-sm-6 col-md-4">
                <div class="value-item">
                  <q-icon name="handshake" color="primary" size="48px" class="q-mb-sm" />
                  <div class="text-h6 text-weight-bold q-mb-xs">Compromiso</div>
                  <p class="text-body2 text-grey-7">
                    Con nuestra comunidad y la verdad
                  </p>
                </div>
              </div>
              <div class="col-12 col-sm-6 col-md-4">
                <div class="value-item">
                  <q-icon name="diversity_3" color="primary" size="48px" class="q-mb-sm" />
                  <div class="text-h6 text-weight-bold q-mb-xs">Cercanía</div>
                  <p class="text-body2 text-grey-7">
                    Somos parte de la comunidad
                  </p>
                </div>
              </div>
              <div class="col-12 col-sm-6 col-md-4">
                <div class="value-item">
                  <q-icon name="lightbulb" color="primary" size="48px" class="q-mb-sm" />
                  <div class="text-h6 text-weight-bold q-mb-xs">Innovación</div>
                  <p class="text-body2 text-grey-7">
                    Adaptándonos a nuevas tecnologías
                  </p>
                </div>
              </div>
              <div class="col-12 col-sm-6 col-md-4">
                <div class="value-item">
                  <q-icon name="gavel" color="primary" size="48px" class="q-mb-sm" />
                  <div class="text-h6 text-weight-bold q-mb-xs">Ética</div>
                  <p class="text-body2 text-grey-7">
                    Periodismo responsable siempre
                  </p>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>

        <!-- Llamado a la acción -->
        <div class="text-center q-pa-xl bg-primary text-white rounded-borders">
          <q-icon name="forum" size="64px" class="q-mb-md" />
          <h3 class="text-h4 q-mb-md">¿Quieres saber más?</h3>
          <p class="text-h6 q-mb-lg">Síguenos en nuestras redes sociales o contáctanos directamente</p>
          <q-btn 
            unelevated 
            color="white" 
            text-color="primary" 
            label="Ir a Contacto" 
            icon="mail"
            size="lg"
            @click="$router.push('/contacto')"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
// Página de información de la empresa
</script>

<style scoped lang="scss">
.value-item {
  text-align: center;
  padding: 16px;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.02);
    border-radius: 8px;
    transition: all 0.3s ease;
  }
}
</style>
