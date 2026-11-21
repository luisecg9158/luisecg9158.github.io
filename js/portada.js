/* Portada de Corcauchos C.A.: selector de sintomas y cotizador por medida. */
var R = {
  lado:    ['Alineación', 'Lo más probable es que necesite alineación', 'Ajustamos los ángulos de las ruedas para que el carro vaya derecho y los cauchos se gasten parejo.', 'quiero hacer una alineación. El carro se va hacia un lado.'],
  vibra:   ['Balanceo', 'Eso suele ser el balanceo', 'Equilibramos cada rueda para que el vehículo ruede sin vibrar.', 'quiero hacer un balanceo. El volante vibra.'],
  espicha: ['Reparación de pinchazos', 'Tráelo y lo revisamos', 'Si el caucho se puede reparar, lo reparamos para que vuelvas a rodar.', 'tengo un caucho espichado y quiero repararlo.'],
  lisos:   ['Cauchos y montaje', 'Es momento de cambiarlos', 'Dinos la medida o mándanos una foto del costado del caucho. Compras aquí y te los montamos en el momento.', 'quiero cotizar cauchos con montaje.\nMedida (o te mando una foto):'],
  prende:  ['Baterías', 'Puede ser la batería', 'Dinos la marca, el modelo y el año de tu vehículo y te recomendamos la batería correcta.', 'mi carro no quiere prender, quiero cotizar una batería.'],
  gasta:   ['Rotación y alineación', 'Una rotación ayuda a que duren más', 'Cambiamos los cauchos de posición cada 8.000 a 10.000 km. Si el desgaste es de un solo lado, revisamos también la alineación.', 'quiero hacer una rotación de cauchos. Se gastan disparejo.'],
  otro:    ['Te orientamos', 'Cuéntanos qué notas', 'Escríbenos lo que le pasa a tu vehículo y te decimos qué hace falta antes de que vengas.', 'no sé qué servicio necesito. Esto es lo que noto:']
};
var wa = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2z"/></svg>';
var caja = document.getElementById('respuesta');
document.querySelectorAll('.sintomas button').forEach(function (b) {
  b.addEventListener('click', function () {
    document.querySelectorAll('.sintomas button').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
    var r = R[b.dataset.s];
    var msg = 'Hola Corcauchos, ' + r[3] + '\nMi vehículo (marca, modelo y año):';
    caja.innerHTML = '<div class="nuevo" style="display:flex;flex-direction:column;flex:1">' +
      '<p class="servicio">' + r[0] + '</p><h3>' + r[1] + '</h3><p>' + r[2] + '</p>' +
      '<a class="boton" href="https://wa.me/584145731823?text=' + encodeURIComponent(msg) + '">' + wa + 'Enviar por WhatsApp</a></div>';
  });
});
document.getElementById('form-medida').addEventListener('submit', function (e) {
  e.preventDefault();
  var m = document.getElementById('ancho').value + '/' + document.getElementById('perfil').value + ' ' + document.getElementById('rin').value;
  var txt = 'Hola Corcauchos, quiero cotizar cauchos medida ' + m + '.\nCantidad:\nMi vehículo (marca, modelo y año):';
  window.open('https://wa.me/584145731823?text=' + encodeURIComponent(txt), '_blank');
});
