<template>
    <Transition name="modalBG">
        <section class="modalContainer" @click.self="$emit('close')">
            <Transition name="modal" appear>
                <article class="modalForm">
                    <section v-if="formType === 'addComment'">
                        <p class="modalForm__comment">Escriba su comentario</p>
                        <textarea 
                            class="modalForm__textarea" 
                            placeholder="Escriba su comentario aquí..."
                            v-model.trim="comment"
                            @keyup="countCharacters"
                            >
                        </textarea>
                        <p 
                        class="modalForm__contador"
                        :class="{'limit': contador === 500}">{{contador}}/500</p>
                        <Transition name="errorMessage">
                            <section v-show="error"
                                class="formContainer__body__form--error">
                                <ul>
                                    <li>El comentario debe tener al menos 10 caracteres</li>
                                </ul>
                            </section>
                        </Transition>
                        <section class="modalForm__error" v-if="error">
                            <p class="modalForm__error__title">Por favor, soluciona el siguiente error:</p>
                            <ul class="modalForm__error__list">
                                <li class="modalForm__error__list--item">El comentario debe tener al menos 10 caracteres.</li>
                            </ul>
                        </section>
                        <section class="modalForm__buttons">
                            <button class="modalForm__buttons--item" @click="addComment">Comentar</button>
                            <button class="modalForm__buttons--item" @click="$emit('close')">Cancelar</button>
                        </section>
                    </section>
                </article>
            </Transition>
        </section>
    </Transition>
</template>

<script>

export default {
    name: "Contact",
    props: {
        formType: {
            type: String,
            required: true
        },
    },
    data() {
        return {
            comment: '',
            contador: 0,
            error: false
        }
    },
    methods: {
        /**
         * Método que cuenta los caracteres del comentario
         */
        countCharacters() {
            this.contador = this.comment.length;
        },
        /**
         * Método que añade un comentario
         */
        addComment() {
            if (this.comment.length < 10) {
                this.error = true;
            } else {
                this.$emit('addComment', this.comment);
                this.comment = '';
                this.contador = 0;
                this.error = false;
            }
        }
    }
}
</script>