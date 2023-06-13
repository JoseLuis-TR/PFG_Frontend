<template>
  <Transition name="modalBG">
    <section class="modalContainer" @click.self="$emit('close')">
      <Transition name="modal" appear>
        <section class="modal">
          <p class="modal__mensaje">{{ mensaje }}</p>
          <div class="modal__buttons">
            <button class="modal__buttons--item" @click="$emit('delete')">Sí</button>
            <button class="modal__buttons--item" @click="$emit('close')">No</button>
          </div>
        </section>
      </Transition>
    </section>
  </Transition>
</template>

<script>

/**
 * @file ModalConfirmacion.vue - Componente para confirmar acciones
 * @author José Luis Tocino Rojo
 * @see <a href="https://github.com/JoseLuis-TR/PFG_Frontend" target="_blank">Github</a>
 * @module Component/Overlays/ModalConfirmacion
 * 
 * @property {Object} props - Propiedades que recibe el componente
 * @property {String} props.mensaje - Mensaje a mostrar en el modal
 * @property {Object} emits - Eventos que emite el componente
 * @property {Function} emits.close - Evento que emite al cerrar el modal
 * @property {Function} emits.delete - Evento que emite al confirmar la acción
 */
export default {
  name: "ModalConfirmacion",
  emits: ["close", "delete"],
  props: {
    mensaje: {
      type: String,
      required: true
    }
  }
}
</script>