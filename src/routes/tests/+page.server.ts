import * as cheerio from 'cheerio';


export const load = async (request) => {
    const cartInfoHtml = `<div class="cart-info">
	<div class="wp-cart-info">
		<h3 class="cart_title">
			<span>INFORMACIÓN SOBRE RESERVAS</span>
			<span class="edit">Editar</span>
		</h3>
		<div class="content-cart-info">
			<span class="placeholder" style="display: none;">Por favor seleccione su asiento</span>
			<div class="item-info header" style="display: flex;">
				<span>Asiento</span>
				<span>Precio</span>
			</div>
			<div class="wp-content-item" style="display: block;">
				<div class="item-info item-info-map" data-qty="4" data-price="1800" style="display: flex;">
					<div class="info-type-ticket">
						<div class="wp-seat-info"><span class="seat-0">VIP_AZUL-SECC-A3-ASTO-L17</span><span
								class="seat-0">VIP_AZUL-SECC-A3-ASTO-I18</span><span
								class="seat-1">PLATINUM_ROJO-SECC-B3-ASTO-R16</span><span
								class="seat-2">ORO_AMARILLO-SECC-C3-ASTO-HH16</span></div>
					</div>
					<div class="info-sub-price">$1,800.00</div>
				</div>
				<div class="item-info area-item area-id-VERDE-SECC-GEN-DER-ASTO" data-max="494" data-id="VERDE-SECC-GEN-DER-ASTO"
					data-qty="3" data-price="300">
					<div class="area-item-wrap">
						<div class="info-type-ticket">
							<p class="title-ticket">VERDE-SECC-GEN-DER-ASTO</p>
						</div>
						<div class="info-qty-ticket"><span class="area-minus"><i aria-hidden="true"
									class="icon_minus-06"></i></span><span class="area-qty">3</span><span class="area-plus"><i
									aria-hidden="true" class="icon_plus"></i></span></div>
						<div class="info-sub-price">$300.00</div>
					</div>
					<ul class="person_type_wrap"></ul>
				</div>
				<div class="item-info area-item area-id-ROSA-SECC-GEN-IZQ-ASTO" data-max="496" data-id="ROSA-SECC-GEN-IZQ-ASTO"
					data-qty="2" data-price="200">
					<div class="area-item-wrap">
						<div class="info-type-ticket">
							<p class="title-ticket">ROSA-SECC-GEN-IZQ-ASTO</p>
						</div>
						<div class="info-qty-ticket"><span class="area-minus"><i aria-hidden="true"
									class="icon_minus-06"></i></span><span class="area-qty">2</span><span class="area-plus"><i
									aria-hidden="true" class="icon_plus"></i></span></div>
						<div class="info-sub-price">$200.00</div>
					</div>
					<ul class="person_type_wrap"></ul>
				</div>
				<div class="item-info area-item area-id-CAFE-SECC-GEN-CENT-ASTO" data-max="499" data-id="CAFE-SECC-GEN-CENT-ASTO"
					data-qty="2" data-price="400">
					<div class="area-item-wrap">
						<div class="info-type-ticket">
							<p class="title-ticket">CAFE-SECC-GEN-CENT-ASTO</p>
						</div>
						<div class="info-qty-ticket"><span class="area-minus"><i aria-hidden="true"
									class="icon_minus-06"></i></span><span class="area-qty">2</span><span class="area-plus"><i
									aria-hidden="true" class="icon_plus"></i></span></div>
						<div class="info-sub-price">$400.00</div>
					</div>
					<ul class="person_type_wrap"></ul>
				</div>
			</div>
			<div class="total-discount" style="display: none;">
				<p class="text">Descuento</p>
				<p class="discount-number" data-discount="0"></p>
			</div>
			<div class="total-tax" style="display: flex;">
				<p class="text">Cargo por (Servicio+IVA)</p>
				<p class="tax-number" data-tax="135">+$135.00</p>
			</div>
			<div class="system-fee" style="display: flex;">
				<p class="text">Entrega Digital</p>
				<p class="system-fee-number" data-system-fee="10">+$10.00</p>
			</div>
			<!-- end wp-content-item -->
		</div>
	</div>
	<div class="total-cart-info" data-price-before-tax="2700" data-price="2845">
		<span class="text">Total</span>
		<span class="total-price">$2,845.00</span>
	</div>
</div>`;
console.log(encodeURIComponent(btoa(cartInfoHtml)));
const seats: { seat: string, amount: number }[] = [];
    const $ = cheerio.load(cartInfoHtml);
    $('.item-info-map').map((i, el) => {
        console.log('info-map', i);
        const qty = el.attribs['data-qty'];
        const price = el.attribs['data-price'];
        console.log('qty', qty);
        console.log('price', price);
        $(el).find('.wp-seat-info span').map((i, el) => {
            console.log('info-map seat info', i);
            // console.log('el', $(this).find().text());
            console.log('el', $(el).text());
            seats.push({
                seat: $(el).text(),
                amount: 1,
                type: 'map',
                // price: parseInt(price),
            });
        });
    });
    
    $('.area-item').map((i, el) => {
        console.log('area-item', i);
        const id = el.attribs['data-id'];
        const qty = el.attribs['data-qty'];
        const price = el.attribs['data-price'];
        console.log('id', id);
        console.log('qty', qty);
        console.log('price', price);
        seats.push({
            seat: id,
            amount: parseInt(qty),
            type: 'area',
            // price: parseInt(price),
        });
    });
    console.log('seats', seats);


    return {
        
    };
}