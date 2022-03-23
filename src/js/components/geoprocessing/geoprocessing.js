
var controlElevation = null
let g_modal_close = true
let geoprocessing = {
  'contour': GeoserviceFactory.Contour,
  'elevationProfile': GeoserviceFactory.ElevationProfile,
  'waterRise': GeoserviceFactory.ElevationProfile
}
let results_counter = 0
let contour_result_active = false

class Geoprocessing {

  formContainer = null;
  geoprocessId = null;
  geoprocessingConfig = null;
  geoprocessing = null;
  optionsForm = null;
  fieldsToReferenceLayers = [];
  editableLayer_name = null;

  svgZoomStyle(zoom) {
    if (contour_result_active) {
      let aux = document.getElementById("fix-textpath")
      /*if (zoom < 14) {
        aux.innerHTML = `
        .leaflet-pane svg text {
          font-size: 0.1em !important;
        }
        `
      } else {
        aux.innerHTML = ""
      }*/

    }
  }
  createIcon() {
    const modalicon = `
    <div class="center-flex" id="iconopenfile-container">
        <span id="spanopenfolder" class="fa fa-cog" aria-hidden="true" ></span>
    </div>
    `;
    const elem = document.createElement("div");
    elem.className = "center-flex"
    elem.id = "geoprocesos-icon"
    elem.title = "Geoprocesos"
    elem.innerHTML = modalicon

    elem.onclick = function () {
      if (g_modal_close) geoProcessingManager.createModal()
    }
    document.getElementById("mapa").appendChild(elem);

  }

  createModal() {
    let divContainer = document.createElement("div")
    divContainer.id = "mr"
    divContainer.className = "modalOpenFile"

    let mainIcons = document.createElement("div")
    mainIcons.className = "icons-modalfile"

    let f_sec = document.createElement("section")
    f_sec.style = "width:95%"

    let s_sec = document.createElement("section")
    s_sec.style = "width:5%"
    let btnclose = document.createElement("a")
    btnclose.id = "btnclose-icon-modalfile"
    btnclose.className = "icon-modalfile"
    btnclose.innerHTML = '<i title="cerrar" class="fa fa-times icon_close_mf" aria-hidden="true"></i>';
    btnclose.onclick = function () {
      divContainer.remove();
    };
    s_sec.append(btnclose);

    mainIcons.append(f_sec)
    mainIcons.append(s_sec)


    let main_container = document.createElement("div")
    main_container.id = "contenedor-geoprocesos"

    let formulario = document.createElement("section")
    formulario.id = "main-Geoprocesos"
    main_container.append(formulario)

    divContainer.append(mainIcons);
    divContainer.append(main_container);
    document.body.appendChild(divContainer);

    const geoprocessingTabContent = document.getElementById('main-Geoprocesos');
    geoprocessingTabContent.innerHTML = '';
    geoprocessingTabContent.appendChild(geoProcessingManager.getForm());


    $("#mr").draggable({
      containment: "#mapa"
    })
  }

  setAvailableGeoprocessingConfig(geoprocessingConfig) {
    this.geoprocessingConfig = geoprocessingConfig;
  }

  displayResult(result) {
    switch (this.geoprocessId) {
      case 'contour': {
        contour_result_active = true
        let style_fix_textpath = document.createElement("style")
        style_fix_textpath.id = "fix-textpath"
        style_fix_textpath.innerHTML = `
        .leaflet-pane svg text {
          font-size: 0.8em;
        }`

        document.head.appendChild(style_fix_textpath);

        let layername = 'contourResult_' + results_counter
        results_counter++

        mapa.getEditableLayer(this.editableLayer_name).setStyle({ fillOpacity: 0 })
        mapa.addGeoJsonLayerToDrawedLayers(result,layername, true, true);
        addedLayers.push({
          id: layername,
          layer:result, 
          name:layername,
          file_name:layername,
          kb:null
        });
        menu_ui.addFileLayer("Geoprocesos", layername, layername, layername);

        break;
      }
      case 'elevationProfile': {
        this.elevationDiv(result)
        break;
      }
      case 'waterRise': {
        let layername = 'waterRise_' + results_counter
        results_counter++
        mapa.getEditableLayer(this.editableLayer_name).setStyle({ fillOpacity: 0 })
        mapa.addGeoJsonLayerToDrawedLayers(result,layername, true, true);
        addedLayers.push({
          id: layername,
          layer:result, 
          name:layername,
          file_name:layername,
          kb:null
        });
        menu_ui.addFileLayer("Geoprocesos", layername, layername, layername);
        break;
      }
    }
    new UserMessage(`Geoproceso ejecutado exitosamente.`, true, 'information');
  }

  updateReferencedDrawedLayers(layers) {

    if (!this.optionsForm)
      return;
    if (this.geoprocessId === "contour") {
      this.fieldsToReferenceLayers.forEach(fieldId => {
        const element = this.optionsForm.getElement(fieldId);
        if (element.hasAttribute('references') && element.getAttribute('references') === 'drawedLayers') {
          const options = [];
          options.push({ value: '', text: '' });
          const layerTypes = element.getAttribute('layerTypes').split(',');
          layerTypes.forEach(type => {
            if (layers.hasOwnProperty(type)) {
              layers[type].forEach(layer => {
                options.push({ value: layer.name, text: layer.name });
              });
            }
          });
          this.optionsForm.setOptionsToSelect(fieldId, options);
        }
      });
    }
    if (this.geoprocessId === "elevationProfile") {
      this.fieldsToReferenceLayers.forEach(fieldId => {
        const element = this.optionsForm.getElement(fieldId);
        if (element.hasAttribute('references') && element.getAttribute('references') === 'drawedLayers') {
          const options = [];
          options.push({ value: '', text: '' });
          const layerTypes = ["polyline"]
          layerTypes.forEach(type => {
            if (layers.hasOwnProperty(type)) {
              layers[type].forEach(layer => {
                options.push({ value: layer.name, text: layer.name });
              });
            }
          });
          this.optionsForm.setOptionsToSelect(fieldId, options);
        }
      });
    }

    if (this.geoprocessId === "waterRise") {
      this.fieldsToReferenceLayers.forEach(fieldId => {
        const element = this.optionsForm.getElement(fieldId);
        if (element.hasAttribute('references') && element.getAttribute('references') === 'drawedLayers') {
          const options = [];
          options.push({ value: '', text: '' });
          const layerTypes = element.getAttribute('layerTypes').split(',');
          layerTypes.forEach(type => {
            if (layers.hasOwnProperty(type)) {
              layers[type].forEach(layer => {
                options.push({ value: layer.name, text: layer.name });
              });
            }
          });
          this.optionsForm.setOptionsToSelect(fieldId, options);
        }
      });
    }
  }

  buildOptionForm(fields) {
    this.optionsForm.clearForm();
    this.fieldsToReferenceLayers = [];
    const formFields = [];

    fields.forEach(field => {

      const id = field.name.toLowerCase().replace(/\s/g, "");

      switch (field.element) {
        case 'select': {
          const selectId = `select-${id}`;

          const options = [];
          options.push({ value: '', text: '' });

          const extraProps = {};
          extraProps.title = field.name;
          if (field.references === 'drawedLayers') {
            this.fieldsToReferenceLayers.push(selectId);
            extraProps.references = 'drawedLayers';
            extraProps.layerTypes = field.allowedTypes;
            const editableLayers = mapa.getEditableLayers();

            if (this.geoprocessId === "contour") {
              editableLayers['rectangle'].forEach(layer => {
                options.push({ value: layer.name, text: layer.name });
              });
            }
            else if (this.geoprocessId === "waterRise") {
              editableLayers['rectangle'].forEach(layer => {
                options.push({ value: layer.name, text: layer.name });
              });
            }
            else if (this.geoprocessId === "elevationProfile") {
              editableLayers['polyline'].forEach(layer => {
                options.push({ value: layer.name, text: layer.name });
              });
            }
          }

          const select = this.optionsForm.addElement('select', selectId, {
            title: field.name,
            events: {
              'change': (element) => {
                if (!element.value)
                  return;
                const layer = mapa.getEditableLayer(element.value);
                mapa.centerLayer(layer);
              }
            },
            extraProps: extraProps
          });
          this.optionsForm.setOptionsToSelect(selectId, options);

          formFields.push(select);
        };
          break;
        case 'input': {
          const extraProps = {};
          extraProps.type = field.type;
          extraProps.title = field.name;
          if (field.hasOwnProperty('min')) {
            extraProps.min = field.min;;
          }
          if (field.hasOwnProperty('max')) {
            extraProps.max = field.max;
          }
          const inputId = `input-${id}`;
          const input = this.optionsForm.addElement('input', inputId, {
            title: field.name,
            extraProps: extraProps
          });

          formFields.push(input);
        }
      }
    });

    //fix input
    if (this.geoprocessId === 'waterRise') {
      const extraProps = {};
      extraProps.type = 'input';
      extraProps.title = 'level';
      const inputId = `input-level`;
      const input = this.optionsForm.addElement('input', inputId, {
        title: 'level',
        extraProps: extraProps
      });

      formFields.push(input);
    }

    this.optionsForm.addButton('Ejecutar', () => {
      let values = [];
      for (let i = 0; i < formFields.length; i++) {
        if (!formFields[i].value) {
          return new UserMessage(`El campo '${formFields[i].title}' está vacío.`, true, 'error');
        }

        if (formFields[i].hasAttribute('references') && formFields[i].getAttribute('references') === 'drawedLayers') {
          const layer = mapa.getEditableLayer(formFields[i].value);
          this.editableLayer_name = layer.name

          switch (this.geoprocessId) {
            case 'contour': {
              const sw = layer.getBounds().getSouthWest();
              values.push(sw.lng);
              values.push(sw.lat);
              const ne = layer.getBounds().getNorthEast();
              values.push(ne.lng);
              values.push(ne.lat);
              break;
            }
            case 'elevationProfile': {
              
              const ca = layer.getLatLngs()[0];
              const cb = layer.getLatLngs()[1];
              
              values = ca.lng + " " + ca.lat + "," + cb.lng + " " + cb.lat
              break;
            }
            case 'waterRise': {
              const sw = layer.getBounds().getSouthWest();
              values.push(sw.lng);
              values.push(sw.lat);
              const ne = layer.getBounds().getNorthEast();
              values.push(ne.lng);
              values.push(ne.lat);
              break;
            }
          }

        } else {
          values.push(+formFields[i].value);
        }
      }

      if (this.geoprocessId === 'contour') {
        this.geoprocessing.execute(...values)
          .then(result => {
            this.displayResult(result);
          })
          .catch(error => {
            new UserMessage(error.message, true, 'error');
          });
      }
      else if (this.geoprocessId === 'elevationProfile') {
        this.geoprocessing.execute(values)
          .then(result => {
            this.displayResult(result);
          })
          .catch(error => {
            //new UserMessage(error.message, true, 'error');
            console.log(error)
          });

      }
      else if (this.geoprocessId === 'waterRise') {

        let waterRise = new GeoserviceFactory.WaterRise(
          this.geoprocessing.host
        );
        waterRise
          .execute(...values)
          .then((result) => {
            this.displayResult(result);
          })
          .catch((error) => {
            new UserMessage(error.message, true, 'error');
          });
      }

    });
  }

  buildForm() {
    const geoprocessingForm = new FormBuilder();
    const container = document.createElement('div');
    container.className = 'geoprocessing-form-container';

    container.appendChild(geoprocessingForm.form);

    const selectProcessId = 'select-process';
    geoprocessingForm.addElement('select', selectProcessId, {
      title: 'Seleccione el geoproceso',
      events: {
        'change': (element) => {
          if (!element.value) {
            this.optionsForm.clearForm();
            return;
          }
          this.geoprocessId = element.value;
          const item = this.geoprocessingConfig.availableProcesses.find(e => e.geoprocess === this.geoprocessId);
          this.geoprocessing = new geoprocessing[this.geoprocessId](item.baseUrl);
          this.buildOptionForm(this.geoprocessing.getFields());
        }
      }
    });

    const options = [];
    options.push({ value: '', text: '' });
    this.geoprocessingConfig.availableProcesses.forEach(geoprocess => {
      options.push({ value: geoprocess.geoprocess, text: geoprocess.name });
    });
    geoprocessingForm.setOptionsToSelect(selectProcessId, options);

    this.optionsForm = new FormBuilder();
    container.appendChild(this.optionsForm.form);

    return container;
  }

  getForm() {
    if (!this.formContainer) {
      this.formContainer = this.buildForm();
      mapa.addMethodToEvent(this.updateReferencedDrawedLayers.bind(this), 'add-layer');
      mapa.addMethodToEvent(this.updateReferencedDrawedLayers.bind(this), 'delete-layer');
    }
    return this.formContainer;
  }

  elevationDiv(result) {
    let mainmodal = document.createElement("div")
    mainmodal.id = "modal-perfil-elevacion"
    mainmodal.className = "modal-perfil-elevacion"

    let dive = document.createElement("div")
    dive.id = "elevation-div"
    dive.className = "elevation-div"
    let modal = document.createElement("div")
    modal.innerHTML = `
        <div id="ContainerER" >
        <div id="icons-table" style="display:flex">
        <div style="width:95%"></div>
        <div style="width:5%"><a id="btnclose" class="icon-table"><span id="removeEP" class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></div>
        </div>
        <div id="elevation-div-results"></div>
        </div>`

    mainmodal.append(modal)
    document.body.appendChild(mainmodal)
    $("#modal-perfil-elevacion").draggable({
      containment: "#mapa",
      scroll: false
    }
    );

    let btnclose = document.getElementById("modal-perfil-elevacion")
    btnclose.onclick = function (){
      $("#modal-perfil-elevacion").remove();
      clearElevationProfile();
      controlElevation = null;
    }

    let aux = document.getElementById("elevation-div-results")
    aux.innerHTML = ""
    aux.append(dive)

    let otraresp = `{"name":"response","type":"FeatureCollection","features":[{"type":"Feature","name":"elevation","geometry":${JSON.stringify(result)},"properties":null}]}`
    let options = {
      summary: "inline",
      detachedView: false,
      elevationDiv: '#elevation-div',
      zFollow: 12,
      legend: false,
    }

    controlElevation = L.control.elevation(options);
    controlElevation.addTo(mapa);
    controlElevation.load(otraresp);
    
  }
}

function clearElevationProfile(){
  for (var l in mapa._layers) {
    if(mapa._layers[l].options && mapa._layers[l].options.pane && mapa._layers[l].options.pane === "elevationPane"){
      mapa._layers[l].remove()
    }
    if(mapa._layers[l].feature && mapa._layers[l].feature.name && mapa._layers[l].feature.name === "elevation"){
      mapa._layers[l].remove()
    }
  }
}
