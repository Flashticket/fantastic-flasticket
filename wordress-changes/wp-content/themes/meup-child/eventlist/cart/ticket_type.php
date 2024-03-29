<?php if( ! defined( 'ABSPATH' ) ) exit();

global $event;
global $el_message_cart;
$cookie_ide 	= isset( $_COOKIE['id_event'] ) ? ( $_COOKIE['id_event'] ) : '';
$cookie_idcal 	= isset( $_COOKIE['id_cal'] ) ? ( $_COOKIE['id_cal'] ) : '';
$id_event 		= isset( $_GET['ide'] ) ? $_GET['ide'] :  $cookie_ide;
$id_calendar 	= isset( $_GET['idcal'] ) ? $_GET['idcal'] : $cookie_idcal;

$list_type_ticket 		= get_post_meta( $id_event, OVA_METABOX_EVENT . 'ticket', true);
$show_remaining_tickets = EL()->options->event->get('show_remaining_tickets', 'yes');

$seat_option 	= get_seat_option( $id_event );
$data_settings 	= EL_Cart::instance()->get_setting_price();
$flag_sold_out 	= [];

$enable_tax 	= EL()->options->tax_fee->get('enable_tax');
$check_allow_change_tax = check_allow_change_tax_by_event( $id_event );

$percent_tax = '';

if ( $check_allow_change_tax == "yes" ) {
	$percent_tax =get_post_meta( $id_event, OVA_METABOX_EVENT . 'event_tax', true );
}

if ( ! empty($percent_tax) || $percent_tax === '0' ) {
	$percent_tax = $percent_tax;
} else {
	$percent_tax = EL()->options->tax_fee->get('pecent_tax');
}

$percent_tax = $enable_tax == 'yes' ? $percent_tax : 0;

// System free
$type_system_fee 	= EL()->options->tax_fee->get('type_system_fee', 'percent');
$percent_system_fee = EL()->options->tax_fee->get('percent_system_fee');
$fixed_system_fee 	= EL()->options->tax_fee->get('fixed_system_fee');

if ( $type_system_fee === 'percent' ) $fixed_system_fee = 0;
if ( $type_system_fee === 'amount' ) $percent_system_fee = 0;

?>

<?php if ( $el_message_cart == "" ):
	if ( ! empty( $list_type_ticket ) && is_array($list_type_ticket) && $seat_option != 'map' ):
		// Data ticket ids
		$ticket_ids = [];
		$ticket_type_price = [];
	?>
		<div 
			class="cart-ticket-info" 
			data-enable-tax="<?php echo esc_attr( $enable_tax ); ?>" 
			data-type-system-fee="<?php echo esc_attr( $type_system_fee ); ?>" 
			data-percent-tax="<?php echo esc_attr( $percent_tax ); ?>" 
			data-percent-system-fee="<?php echo esc_attr( $percent_system_fee ); ?>" 
			data-fixed-system-fee="<?php echo esc_attr( $fixed_system_fee ); ?>" 
			data-seat-option="<?php echo esc_attr( $seat_option ); ?>" 
			data-id-cal="<?php echo esc_attr( $id_calendar ); ?>" 
			data-id-event="<?php echo esc_attr( $id_event ); ?>" 
			data-setting="<?php echo esc_attr( $data_settings ); ?>" 
			data-ticket-ids="">
			<div class="error-empty-cart">
				<span class="empty-item-cart">
					<?php esc_html_e("Please Select Your Ticket", "eventlist"); ?>
				</span>
				<span class="error-empty">
					<?php esc_html_e("Please select seat", "eventlist"); ?>
				</span>
				<span class="error-duplicate">
					<?php esc_html_e("Error seat duplicate", "eventlist"); ?>
				</span>
			</div>
			<div class="item-ticket-type header">
				<div class="ticket-name">
					<p><?php esc_html_e("Ticket Type", "eventlist"); ?></p>
				</div>
				<div class="price-ticket">
					<p><?php esc_html_e("Unit Price", "eventlist"); ?></p>
				</div>
				<div class="quanty-ticket">
					<p><?php esc_html_e("Quantity", "eventlist"); ?></p>
				</div>
			</div>
			<?php 
			$i = 0;
			foreach ( $list_type_ticket as $ticket ):
				$i++;
				$price_display = $price_calc = "";
				 
				$is_open = EL_Cart::instance()->is_booking_ticket_by_date_time($ticket['start_ticket_date'], $ticket['start_ticket_time'], $ticket['close_ticket_date'], $ticket['close_ticket_time'], $id_event );

				if ( ! $is_open ) {
					continue;
				}

				// Data ticket ids
				array_push( $ticket_ids, trim($ticket['ticket_id']) );
				$ticket_type_price[trim($ticket['ticket_id'])] = $ticket['type_price'];

				$list_seat_rest = EL_Booking::instance()->get_list_seat_rest($id_event, $id_calendar, $ticket['ticket_id']);

				switch ( $ticket['type_price'] ) {
					case 'paid' : {
						$price_display = el_price( $ticket['price_ticket'] );
						$price_calc = $ticket['price_ticket'];
						break;
					}
					case 'free' : {
						$price_display = el_price( 0 );
						$price_calc = 0;
						break;
					}
				}

				$number_ticket_rest = EL_Booking::instance()->get_number_ticket_rest($id_event, $id_calendar,  $ticket['ticket_id']);

				if ( $number_ticket_rest == 1 ) {
					$ticket_text = esc_html__( 'ticket', 'eventlist' );
				} else {
					$ticket_text = esc_html__( 'tickets', 'eventlist' );
				}

				?>
			<div>
				<br>
					<p class="anuncioimg">Para visualizar el mapa, haz clic en el ícono de asientos.</p>
				<br>				
			</div>
				<div class="item-ticket-type item-<?php echo esc_attr($ticket['ticket_id']); ?>" 
					data-setup_seat="<?php echo esc_attr($ticket['setup_seat']); ?>" 
					data-list-seat-rest="<?php echo esc_attr(json_encode($list_seat_rest)); ?>" 
					data-select-seat-text="<?php esc_html_e( 'Select seat', 'eventlist' ); ?>">
					<div class="ticket-name">
						<p><?php echo esc_html( $ticket['name_ticket'] ); ?></p>
						<?php if ( $show_remaining_tickets == 'yes' ) { ?>
							<p class="number_ticket_rest">
								<?php echo esc_html( '('. $number_ticket_rest.'&nbsp;'.$ticket_text.')'); ?>
							</p>
						<?php } ?>
					</div>
					<?php if ( isset( $ticket['setup_seat'] ) && $ticket['setup_seat'] === 'yes' ):
						if ( isset( $ticket['seat_map_ticket'] ) && absint( $ticket['seat_map_ticket'] ) ):
							$image_map_url = wp_get_attachment_image_url( $ticket['seat_map_ticket'], 'full' );
							$image_map_alt = get_post_meta( $ticket['seat_map_ticket'] , '_wp_attachment_image_alt', true );
					?>
					<a 
						href="<?php echo esc_url( $image_map_url ); ?>" 
						class="image-seat" 
						data-fancybox 
						data-src="<?php echo esc_url( $image_map_url ); ?>" 
						data-caption="<?php echo esc_attr( $image_map_alt ); ?>">
						<?php
							echo file_get_contents( EL_PLUGIN_URI.'assets/img/seats.svg' ); 
						?>
					</a>
					<?php endif; endif; ?>
					<div class="wp-select-seat"></div>
					<div class="price-ticket">
						<p><?php echo $price_display; ?></p>
					</div>
					<div class="quanty-ticket">
						<?php
						$setting_min_num = (int)$ticket['number_min_ticket'];
						$setting_max_num = (int)$ticket['number_max_ticket'];
						$number_ticket_rest = EL_Booking::instance()->get_number_ticket_rest($id_event, $id_calendar, $ticket['ticket_id']);

						$min_num = $setting_min_num;
						$max_num = min( $number_ticket_rest, $setting_max_num );

						if ($seat_option == 'simple') {
							$max_num = min( $setting_max_num, count($list_seat_rest) );
						}

						?>
						<span class="error error-min-num">
							<?php echo esc_html__("Min number ticket is ", "eventlist") . $min_num; ?>
						</span>
						<div class="control">
						<?php 
							$sold_out = true; 
							if ( $max_num > 0 && $min_num <= $max_num ):
								$flag_sold_out[] = "" ; 
								$sold_out = false; ;
						?>
								<span
									class="minus"
									data-min-num="<?php esc_attr_e($min_num); ?>"
									data-price="<?php echo esc_attr( $price_calc ); ?>"
									data-title="<?php echo esc_attr( $ticket['name_ticket'] ); ?>"
									data-id-ticket="<?php echo esc_attr($ticket['ticket_id']); ?>">
									<i class="fas fa-minus"></i>
								</span>
								<span class="qty qty-<?php echo esc_attr($ticket['ticket_id']); ?>">0</span>
								<span
									class="plus"
									data-mark="0"
									data-max-num="<?php echo esc_attr($max_num); ?>"
									data-price="<?php echo esc_attr( $price_calc ); ?>"
									data-title="<?php echo esc_attr( $ticket['name_ticket'] ); ?>"
									data-id-ticket="<?php echo esc_attr($ticket['ticket_id']); ?>">
									<i class="fas fa-plus"></i>
								</span>
							<?php else:
								if ( ( $key = array_search( trim( $ticket['ticket_id'] ), $ticket_ids ) ) !== false ) {
								    array_splice( $ticket_ids, $key, 1 );
								}
								if ( isset( $ticket_type_price[trim( $ticket['ticket_id'] )] ) ) {
									unset( $ticket_type_price[trim( $ticket['ticket_id'] )] );
								}

								$flag_sold_out[] = 'sold_out';
							?>
								<span class="sold-out"><?php esc_html_e("Sold out", "eventlist"); ?></span>
							<?php endif; ?>
						</div>
						<span class="error error-max-num">
							<?php echo esc_html__("Max number ticket is ", "eventlist") . $max_num; ?>
						</span>
						<?php if ( ! $sold_out ) : ?>
							<a id="btn-delete-item-cart" title="<?php esc_attr_e("Delete item to cart", "eventlist"); ?>" data-min="<?php echo esc_attr($min_num); ?>" data-id="<?php echo esc_attr($ticket['ticket_id']); ?>" href="javascript: void(0)" class="btn-delete-item-cart">
								<i class="fas fa-times"></i>
							</a>
						<?php endif; ?>
					</div>
				</div>
			<?php endforeach; ?>
			<?php 

			$number_item = count($flag_sold_out);
			$arr_value_count = array_count_values($flag_sold_out);
			$sold_out_all = 0;
			if ( isset($arr_value_count['sold_out']) && $number_item == $arr_value_count['sold_out']) {
				$sold_out_all = 1;
			}
			?>
			<input 
				type="hidden" 
				name="ticket_ids" 
				value="<?php echo esc_attr( json_encode( $ticket_ids ) ); ?>" 
				data-type-price="<?php echo esc_attr( json_encode( $ticket_type_price ) ); ?>" />
		</div>
		<input type="hidden" name="sold_all" value="<?php echo esc_attr($sold_out_all); ?>">
	<?php endif; //if wrapper ?>

	<!-- Display Ticket Map Type -->
	<?php if ( $seat_option === 'map' ):
		$ticket_map = get_post_meta( $id_event, OVA_METABOX_EVENT.'ticket_map', true ) ? get_post_meta( $id_event, OVA_METABOX_EVENT.'ticket_map', true ) : array();

		$max_ticket = $ticket_map['number_max_ticket'];
		$min_ticket = $ticket_map['number_min_ticket'];

		// Seats
		$data_seat = isset( $ticket_map['seat'] ) && is_array( $ticket_map['seat'] ) ? $ticket_map['seat'] : [];

		// Area
		$data_area = isset( $ticket_map['area'] ) && is_array( $ticket_map['area'] ) ? $ticket_map['area'] : [];

		// Person type
		$data_person_type = isset( $ticket_map['person_type'] ) && $ticket_map['person_type'] ? json_decode( $ticket_map['person_type'], true ) : [];
		
		// Booked
		$seat_booked = EL_Booking::instance()->get_list_seat_map_booked( $id_event, $id_calendar );

		$seat_available = EL_Booking::instance()->el_get_area_qty_available( $id_event, $id_calendar );

		// Past & Upcoming
		$seat_status 	= EL_Booking::instance()->get_data_seat_map_status( $id_event, $seat_booked );
		$type_ticket 	= $seat_past = $seat_upcoming = [];

		if ( $seat_status ) {
			$type_seat 		= $seat_status['type_seat'];
			$seat_past 		= $seat_status['past'];
			$seat_upcoming 	= $seat_status['upcoming'];
		}

		?>
			<div >
  				<p class="anuncioimg contenido-escritorio">
    				Para seleccionar asientos en un evento, haz clic en la sección que deseas y luego haz clic en los asientos que deseas reservar. Los asientos seleccionados aparecerán en el lado                         derecho de la página "INFORMACIÓN SOBRE RESERVAS".
 				 </p>
						<br>
			</div>
			<div >
  					<p class="anuncioimg contenido-movil">
						Toca la sección que desees dentro del mapa y luego selecciona los asientos que quieras adquirir. <br>Consulta los asientos seleccionados en la parte inferior de esta página y para zona general, especifica el número de asistentes.
 				 	</p>
						<br>
			</div>
		<div class="seat-types">
			<?php if ( isset( $ticket_map['desc_seat'] ) && $ticket_map['desc_seat'] ):
				foreach ( $ticket_map['desc_seat'] as $value ): ?>
					<div class="seat-type">
						<table class="w-100">
							<tbody class="w-100">
								<tr>
									<td width="30">
										<div style="background-color: <?php echo esc_attr( $value['map_color_type_seat'] ); ?>; border: 1px solid #aaa; width: 30px; height: 30px;" class="color"></div>
									</td>
									<td>
										<p class="name_type">
											<?php echo esc_html( $value['map_type_seat'] ); ?>
										</p>
										<span class="price">
											<?php echo esc_html( el_price( $value['map_price_type_seat'] ) ); ?>
										</span>
										<?php if ( isset( $type_seat[$value['map_type_seat']] ) && $type_seat[$value['map_type_seat']] ): ?>
											<span class="type_seat_status">
												<?php echo esc_html( '('.$type_seat[$value['map_type_seat']]. ')' ); ?>
											</span>
										<?php endif; ?>
									</td>
									<td width="30" >
										<div class="text-right">
											<i class="fas fa-info-circle"></i>
											<span class=""><?php echo esc_html( $value['map_desc_type_seat'] ); ?></span>
										</div>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
			<?php endforeach;
			endif; ?>
		</div>
		<div class="cart-ticket-info event_ticket_map_type" 
			data-enable-tax="<?php echo esc_attr( $enable_tax ); ?>" 
			data-percent-tax="<?php echo esc_attr( $percent_tax ); ?>" 
			data-type-system-fee="<?php echo esc_attr( $type_system_fee ); ?>" 
			data-percent-system-fee="<?php echo esc_attr( $percent_system_fee ); ?>" 
			data-fixed-system-fee="<?php echo esc_attr( $fixed_system_fee ); ?>" 
			data-seat-option="<?php echo esc_attr( $seat_option ); ?>" 
			data-id-cal="<?php echo esc_attr( $id_calendar ); ?>" 
			data-id-event="<?php echo esc_attr( $id_event ); ?>" 
			data-setting="<?php echo esc_attr( $data_settings ); ?>" 
			data-max_ticket="<?php echo esc_attr( $max_ticket ); ?>" 
			data-min_ticket="<?php echo esc_attr( $min_ticket ); ?>">
			<input type="hidden" name="sold_all" value="0">
			<div class="error-empty-cart">
			<span class="empty-item-cart type-seat"><?php esc_html_e("Please select seat", "eventlist"); ?></span>
			</div>
			<div class="error-seat-status">
				<span class="error error-max-num">
					<?php esc_html_e("Max number seat is ", "eventlist"); echo $max_ticket; ?>
				</span>
				<span class="error error-min-num">
					<?php esc_html_e("Min number seat is ", "eventlist"); echo $min_ticket; ?>
				</span>
				<span class="error error-booked">
					<?php esc_html_e("This seat has been booked", "eventlist"); ?>
				</span>
				<span class="error error-closed">
					<?php esc_html_e("This seat has been closed", "eventlist"); ?>
				</span>
				<span class="error error-upcoming">
					<?php esc_html_e("This seat will be available for sale soon", "eventlist"); ?>
				</span>
			</div>
			<div class="error-area-status">
				<span class="error error-maxium-number" data-mess="<?php esc_attr_e('Maximum number is', 'eventlist'); ?>"></span>
				<span class="error error-max-num">
					<?php esc_html_e("Max number area is ", "eventlist"); echo $max_ticket; ?>
				</span>
				<span class="error error-min-num">
					<?php esc_html_e("Min number area is ", "eventlist"); echo $min_ticket; ?>
				</span>
				<span class="error error-outofstock">
					<?php esc_html_e("This area is out of stock", "eventlist"); ?>
				</span>
				<span class="error error-closed">
					<?php esc_html_e("This area has been closed", "eventlist"); ?>
				</span>
				<span class="error error-upcoming">
					<?php esc_html_e("This area will be available for sale soon", "eventlist"); ?>
				</span>
			</div>
			<?php if ( $ticket_map['short_code_map'] ) echo do_shortcode( $ticket_map['short_code_map'] ); ?>
			<input
				type="hidden"
				class="ova-data-seat"
				name="ova-data-seat"
				data-seat="<?php echo esc_attr( wp_json_encode( $data_seat ) ); ?>"
				data-seat-booked="<?php echo esc_attr( wp_json_encode( $seat_booked ) ); ?>"
				data-seat-past="<?php echo esc_attr( wp_json_encode( $seat_past ) ); ?>"
				data-seat-upcoming="<?php echo esc_attr( wp_json_encode( $seat_upcoming ) ); ?>"
				data-area="<?php echo esc_attr( wp_json_encode( $data_area ) ); ?>"
				data-person-type="<?php echo esc_attr( wp_json_encode( $data_person_type ) ); ?>"
				data-seat-available="<?php echo esc_attr( wp_json_encode( $seat_available ) ); ?>"
			/>
			<!-- <?php esc_html_e( 'We are working this feature', 'eventlist' ); ?> -->
		</div>
		<?php if ( apply_filters( 'elft_show_seat_notes', true ) ): ?>
			<ul class="cart-seat-notes">
				<li class="item-seat-note">
					<span class="imp-object-oval selected"></span>
					<span class="note"><?php esc_html_e( 'Selling', 'eventlist' ); ?></span>
				</li>
				<li class="item-seat-note">
					<span class="imp-object-oval booked"></span>
					<span class="note"><?php esc_html_e( 'Booked', 'eventlist' ); ?></span>
				</li>
				<li class="item-seat-note">
					<span class="imp-object-oval past"></span>
					<span class="note"><?php esc_html_e( 'Past', 'eventlist' ); ?></span>
				</li>
				<li class="item-seat-note">
					<span class="imp-object-oval upcoming"></span>
					<span class="note"><?php esc_html_e( 'Upcoming', 'eventlist' ); ?></span>
				</li>
			</ul>
		<?php endif; ?>
	<?php endif; ?>
<?php else: //if message ?>
	<p class="error-item"><?php echo esc_html($el_message_cart); ?></p>
<?php endif; //if message ?>
<?php if( current_user_can( 'administrator' ) ){
	echo '<button id="buyAll" style="position:fixed; height:60px; bottom:40px; right:40px; background-color:#0C9; color:#FFF; border-radius:50px; text-align:center; box-shadow: 2px 2px 3px #999;" onclick="buyAll()"><i>Comprar todos los asientos</i></button>';
    echo '<button id="refreshPage" style="position:fixed; height:60px; bottom:40px; right:40px; background-color:#0C9; color:#FFF; border-radius:50px; text-align:center; box-shadow: 2px 2px 3px #999; display: none" onclick="refreshPage()"><i>Refrescar</i></button>';
} ?>



<button id="botonFlotante" class="floating-button mobile-only" onclick="scrollToBotonFinal()"><i>Pagar</i></button>
<script>
  function scrollToBotonFinal() {
    var botonSiguiente = document.querySelector(".cart-sidebar");
    var botonFlotante = document.getElementById("botonFlotante");
    if (botonSiguiente) {
      botonSiguiente.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
  	

</script>
<?php if ( current_user_can( 'administrator' ) ): ?>
	<script>
		function buyAll() {
			var urlParams = new URLSearchParams(window.location.search);
			var eventId = urlParams.get('ide');
			var idCal = urlParams.get('idcal');
			var payload = document.getElementsByClassName('cart-info').item(0).outerHTML;
			// delete local storage item named 15857_1708643128 and manually refresh the page after printing tickets
			localStorage.removeItem(eventId+'_'+idCal);
            var el = window.document.getElementsByClassName('imp-ui-wrap');
            document.getElementById('buyAll').style.display = 'none';
            document.getElementById('refreshPage').style.display = '';
            if (el && el.length > 0) {
                el[0].style.display = 'none';
            }
            const url = document.location.href.startsWith('https://flashticket.com.mx/') ? 'https://app.flashticket.com.mx/' : 'https://app.boletera.dev-mt.com/';
            window.open(url + '?eventId='+eventId+'&idCal='+idCal+'&seats='+encodeURIComponent(btoa(payload)), '_blank');
		}
        function refreshPage() {
            window.document.location.reload();
        }
	</script>
<?php endif; ?>


<style>
	
.asientos {
 
  background-color: #83EA83;
  border: 2px solid #666666;
  padding: 10px;
  margin: 10px;
  border-radius: 5px;
  text-align: center;
}

.anuncioimg {
		
  background-color: #83EA83;
  border: 2px solid #666666;
  padding: 10px;
  margin: 10px;
  border-radius: 5px;
  text-align: center;
}	
	.contenido-escritorio{
			display:block;
	}
	.contenido-movil
	{
		
			display:none;
	}
	
			@media screen and (max-width:768px){
			
				.contenido-escritorio{
			display:none;
	}
	.contenido-movil
	{
		
			display:block;
	}
		}
	/* Estilo predeterminado para ocultar el botón en la versión de escritorio */
.floating-button {
	  position: fixed; /* Hace que el botón flotante sea fijo en la ventana del navegador */
      bottom: 10px; /* Ajusta la distancia desde la parte inferior de la ventana */
      right: 10px; /* Ajusta la distancia desde el borde derecho de la ventana */
  	  z-index: 9999; /* Ajusta el orden de apilamiento para asegurarte de que esté encima de los demás elementos */
  	  display: none;
      width: 50px;
      height: 50px;
      background-color: #64B464;
      color: #fff;
      border: none;
      border-radius: 50%;
      cursor: pointer;
      justify-content: center;
      align-items: center;
      font-size: 10px;
}

/* Media query para mostrar el botón solo en dispositivos móviles */
@media (max-width: 767px) {
  .mobile-only {
    display: flex;
  }
}
</style>