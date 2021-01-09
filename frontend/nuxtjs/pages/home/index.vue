<template>
  <div>
    <a-row>
      <a-col class="leftContent" :span="12">
        <center>
          HOME
        </center>
      </a-col>
      <a-col class="rightContent" :span="12">
        HOME
      </a-col>
    </a-row>
    <Geoloc />
  </div>
</template>

<script>
import { validGeoloc } from '@/plugins/mixins'

export default {
  mixins: [validGeoloc],
  layout: 'corners'
}
</script>
