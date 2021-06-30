<template>
  <div ref="map-root" style="width: 100%; height: 100%"></div>
</template>

<script lang="ts">
import 'ol/ol.css';

import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { transform } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Draw from 'ol/interaction/Draw';

import { defineComponent } from 'vue';

import {
  MAP_COO_SYSTEM,
  MAP_CENTER,
  MAP_ZOOM,
  LON_LAT_COO_SYSTEM,
  MAP_TYPES,
  INTERACTION_TYPES,
  LAYER_TYPES,
} from './../models';
import GeometryType from 'ol/geom/GeometryType';

export default defineComponent({
  name: 'GameMap',
  props: {
    pickCoordinate: Boolean,
  },
  emits: ['update:coordinate'],
  data: () => ({
    olMap: new Map({}),
  }),
  mounted() {
    const vl = new VectorLayer({
      source: new VectorSource({ features: [] }),
    });
    vl.set(MAP_TYPES.Layer, LAYER_TYPES.Coordinate);

    this.olMap = new Map({
      // the map will be created using the 'map-root' ref
      target: this.$refs['map-root'] as HTMLElement,
      layers: [
        // adding a background tiled layer
        new TileLayer({
          source: new OSM(), // tiles are served by OpenStreetMap
        }),
        vl,
      ],

      // the map view will initially show the whole world
      view: new View({
        zoom: MAP_ZOOM,
        center: transform(MAP_CENTER, LON_LAT_COO_SYSTEM, MAP_COO_SYSTEM),
        constrainResolution: true,
      }),
    });

    if (this.pickCoordinate) this.addInteraction();
  },
  watch: {
    pickCoordinate(newVal) {
      const drawLayer = this.olMap
        .getLayers()
        .getArray()
        .filter((l) => l.get(MAP_TYPES.Layer) === LAYER_TYPES.Coordinate);

      if (newVal) this.addInteraction();
      else if (!newVal && drawLayer) {
        const interaction = this.olMap
          .getInteractions()
          .getArray()
          .find((i) => i.get(MAP_TYPES.Interaction) === INTERACTION_TYPES.Draw);
        if (interaction) this.olMap.removeInteraction(interaction);
      }
    },
  },
  methods: {
    addInteraction() {
      const vl = this.olMap
        .getLayers()
        .getArray()
        .find((l) => l.get(MAP_TYPES.Layer) === LAYER_TYPES.Coordinate);

      if (!vl) return;

      var draw = new Draw({
        source: (vl as VectorLayer).getSource(),
        type: GeometryType.POINT,
      });
      this.olMap.addInteraction(draw);
    },
  },
});
</script>
