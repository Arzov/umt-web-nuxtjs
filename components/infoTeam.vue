<template>
  <div class="tabs">
    <a-tabs default-active-key="1" class="tabPane" size="large">
      <a-tabPane key="1" :tab="title1">
        <h4>JUGADORES</h4>
        <br>
        <a-row :gutter="[0, 0]" type="flex">
          <a-col
            v-for="k in require('./../static/data/players.json')"
            :key="`r${k.name}`"
            :span="24"
          >
            <ListBtn
              :key="`l${k.name}`"
              :desc="k.name"
              :picture1="k.img"
              :value="k.name"
              @click.native="click()"
            />
          </a-col>
        </a-row>
        <a-form-model-item>
          <PrincipalBtn
            text="+ AGREGAR JUGADOR (3/30)"
            :loading="btnLoading"
            @click.native="addPlayer()"
          />
        </a-form-model-item>
      </a-tabPane>
      <a-tabPane key="2" :tab="title2">
        Content of Tab Pane 2
      </a-tabPane>
    </a-tabs>
  </div>
</template>

<script>
export default {
  props: {
    title1: {
      type: String,
      default: 'Tab1'
    },
    title2: {
      type: String,
      default: 'Tab2'
    }
  },
  methods: {
    click () {
      console.log('Probando click de listDisplay para el chat')
    },
    addPlayer () {
      console.log('Probando click para agregar jugadores')
    }
  }
}
</script>
