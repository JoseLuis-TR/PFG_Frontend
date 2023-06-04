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
        name: "FormModal",
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
             * Cuenta los caracteres que se introducen en el textarea
             */
            countCharacters(){
                this.contador = this.comment.length;

                if(this.contador > 500){
                    this.comment = this.comment.substring(0, 500);
                }
            },
            addComment(){
                if(this.contador < 10){
                    this.error = true;
                    return;
                }else{
                    this.error = false;
                    const commentPost = {
                        id_usuario: 1,
                        id_pelicula: this.$route.params.id,
                        texto: this.comment
                    }
                    console.log(commentPost);
                    const options = {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(commentPost)
                    }
                    console.log(options);
                    const apiUrl = import.meta.env.VITE_API_URL;
                    fetch(`${apiUrl}/comentarios`, options)
                        .then(response => response.json())
                        .then(data => {
                            this.$emit('close');
                            //this.$emit('addComment', data.comentario);
                        })
                }
            }
        }
    }
</script>