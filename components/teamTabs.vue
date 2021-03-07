<template>
  <div class="teamTabs">
    <a-tabs default-active-key="1" class="tabPane" size="large">
      <a-tabPane key="1" tab="ACTIVOS">
        <ListDisplay
          title="FC BARCELONA"
          desc="Matias: Hola chicos, todos listos?"
          type="none"
          @click.native="click()"
        />
        <ListDisplay
          title="MAN. UNITED"
          desc="Franco: Buena Cabros!"
          @click.native="click()"
        />
      </a-tabPane>
      <a-tabPane key="2" tab="SOLICITUDES">
        Content of Tab Pane 2
      </a-tabPane>
    </a-tabs>
  </div>
</template>

<script>
export default {
  props: {
  },
  methods: {
    click () {
      console.log('Probando click de listDisplay para el chat')
    }
  }
}
</script>
