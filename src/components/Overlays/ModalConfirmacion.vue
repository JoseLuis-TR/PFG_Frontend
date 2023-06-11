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
export default {
  name: "ModalConfirmacion",
  props: {
    mensaje: {
      type: String,
      required: true
    }
  }
}
</script>