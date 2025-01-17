<?php defined( 'ABSPATH' ) || exit;

/**
 * New order
 */

if ( ! function_exists('el_sendmail_by_booking_id') ) {
	function el_sendmail_by_booking_id( $booking_id = null, $order_status = '', $receiver = '' ) {
        // we need to return $data['status'] = "success";
        $baseUrl = '';
        if ( get_site_url() == 'https://flashticket.com.mx' ) {
            $baseUrl = 'https://app.flashticket.com.mx';
        } else {
            $baseUrl = 'https://app.boletera.dev-mt.com';
        }
		error_log("baseUrl: {$baseUrl}");
		$finalUrl = "{$baseUrl}/api/booking/{$booking_id}/sendTicketsAsync";
		error_log("finalUrl: {$finalUrl}");
		// $response = wp_remote_post( $finalUrl, array(
		// 	'timeout'     => 300,
		// 	'headers'     => array(),
		// ) );
		$ch = curl_init($finalUrl);
		$headers = [
			'Host: app.boletera.dev-mt.com',
			'Accept: */*',
			'Content-Type: application/json',
		];
		curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch, CURLOPT_POST, true);
		curl_setopt($ch, CURLOPT_TIMEOUT, 300);
		$response = curl_exec($ch);

        $data = []; // Initialize an empty array
        if ( curl_errno($ch) ) {
			error_log("Error: " . curl_error($ch));
            $data['status'] = "failure";
        } else {
			error_log("Success: ");
            $data['status'] = "success";
        }
		curl_close($ch);
        return $data;
        // $settings_mail 		= EL()->options->mail;
		// $setting_mail_to 	= $settings_mail->get( 'new_booking_sendmail' );
		// $body_mail 			= $settings_mail->get( 'email_template' );
		// $name_from 			= $settings_mail->get( 'from_name' );
		// $send_each_customer = $settings_mail->get( 'booking_send_each_customer' );
		// $vendor_recipient 	= $settings_mail->get( 'mail_new_vendor_recipient', '' );

		// $event_name 		= get_post_meta( $booking_id, OVA_METABOX_EVENT . 'title_event', true );
		// $list_type_ticket 	= get_post_meta( $booking_id, OVA_METABOX_EVENT . 'list_id_ticket', true );
		// $id_event 			= get_post_meta( $booking_id, OVA_METABOX_EVENT . 'id_event', true );
		// $id_calendar 		= get_post_meta( $booking_id, OVA_METABOX_EVENT . 'id_cal', true );
		// $name_customer 		= get_post_meta( $booking_id, OVA_METABOX_EVENT . 'name', true );
		// $phone_customer 	= get_post_meta( $booking_id, OVA_METABOX_EVENT . 'phone', true );
		// $email_customer 	= get_post_meta( $booking_id, OVA_METABOX_EVENT . 'email', true );
		// $address 			= get_post_meta( $id_event, OVA_METABOX_EVENT . 'address', true );
		// $arr_venue 			= get_post_meta( $id_event, OVA_METABOX_EVENT . 'venue', true );
		// $total_after_tax 	= get_post_meta( $booking_id, OVA_METABOX_EVENT . 'total_after_tax', true );
		// $multiple_ticket 	= get_post_meta( $booking_id, OVA_METABOX_EVENT . 'multiple_ticket', true );

		// $list_qty_ticket_by_id_ticket = get_post_meta( $booking_id, OVA_METABOX_EVENT . 'list_qty_ticket_by_id_ticket', true );

		// $event_type = get_post_meta($id_event, OVA_METABOX_EVENT . 'event_type', true);

		// $total_after_tax = el_price($total_after_tax);
		// $venue = "";

		// if ( is_array( $arr_venue ) ) {
		// 	$venue = implode(', ', $arr_venue);
		// }

		// if ( $event_type == 'online' ) {
		// 	$address = $venue = esc_html__( 'online', 'eventlist' );
		// }

		// $mail_to = [];

		// $author_id_event 	= get_post_field("post_author", $id_event);
		// $email_author 		= get_the_author_meta("email", $author_id_event);

		// if ( is_array( $setting_mail_to ) && in_array( 'event_manager', $setting_mail_to ) && $receiver == '' ) {
		// 	$mail_to[] = $email_author;
		// }

		// if ( is_array( $setting_mail_to ) && in_array( 'customer', $setting_mail_to ) ) {
		// 	if ( $multiple_ticket != 'yes' ) {
		// 		$mail_to[] = $email_customer;
		// 	} else {
		// 		if ( ! $send_each_customer ) {
		// 			$mail_to[] = $email_customer;
		// 		}
		// 	}
		// }

		// $mail_to = implode(",", $mail_to);
		// $mail_to = $vendor_recipient != '' ? $vendor_recipient.','.$mail_to : $mail_to;
		// $mail_to = apply_filters( 'el_send_booking_mails', $mail_to );

		// $list_ticket_in_event = get_post_meta( $id_event, OVA_METABOX_EVENT . 'ticket', true );
		// $seat_option = get_post_meta($id_event, OVA_METABOX_EVENT . 'seat_option', true);

		// $list_name_ticket = $list_id_ticket = [];

		// if ( is_array( $list_ticket_in_event ) && !empty( $list_ticket_in_event ) && $seat_option != 'map' ) {
		// 	foreach ( $list_ticket_in_event as $ticket ) {
		// 		if ( isset( $list_qty_ticket_by_id_ticket[ $ticket['ticket_id'] ] ) && $list_qty_ticket_by_id_ticket[ $ticket['ticket_id'] ] ) {
		// 			$online_info = '';

		// 			if ( $event_type == 'online' ) {

		// 				$online_link = isset( $ticket['online_link'] ) ? $ticket['online_link'] : '';
		// 				$online_password = isset( $ticket['online_password'] ) ? $ticket['online_password'] : '';
		// 				$online_other = isset( $ticket['online_other'] ) ? $ticket['online_other'] : '';

		// 				if( $online_link ){
		// 					$online_info .=	esc_html__( 'Link:', 'eventlist' ).' '.$online_link.'<br/>';
		// 				}
		// 				if( $online_password ){
		// 					$online_info .=	esc_html__( 'Password:', 'eventlist' ).' '.$online_password.'<br/>';
		// 				}

		// 				if( $online_other ){
		// 					$online_info .= esc_html__( 'Other info:', 'eventlist' ).' '.$online_other.'<br/>';	
		// 				}
		// 			}
					
		// 			$list_name_ticket[$ticket['ticket_id']] = '<strong>'.$ticket['name_ticket'].'</strong>'.' - '.$list_qty_ticket_by_id_ticket[ $ticket['ticket_id'] ].' '.esc_html__( 'ticket(s)', 'eventlist' ).$online_info;
		// 			$list_id_ticket[] = $ticket['ticket_id'];

		// 		}
		// 	}
		// }

		// $list_id_ticket_booked = json_decode( $list_type_ticket );
		// $html_type_ticket = [];

		// if ( is_array( $list_id_ticket_booked ) && ! empty( $list_id_ticket_booked ) ) {
		// 	foreach ( $list_id_ticket_booked as $id_ticket ) {

		// 		$ticket_transfer = get_post_meta( $id_ticket, OVA_METABOX_EVENT.'transfer_status', true );
		// 		// check ticket transfered
		// 		if ( $ticket_transfer !== 'yes' ) {

		// 			if ( $seat_option != 'map' ) {
		// 				if ( in_array( $id_ticket, $list_id_ticket ) ) {
		// 					$html_type_ticket[] = $list_name_ticket[$id_ticket];
		// 				}
		// 			} else {
		// 				$html_type_ticket[] = '<strong>'.$id_ticket.'</strong>';
		// 			}

		// 		}
				
		// 	}
		// }

		// $html_type_ticket 	= implode( ', ', $html_type_ticket );
		// $data_calendar 		= el_get_calendar_core( $id_event,  $id_calendar );
		// $start_time 		= el_get_time_int_by_date_and_hour( $data_calendar['date'], $data_calendar['start_time'] );
		// $end_time 			= el_get_time_int_by_date_and_hour( $data_calendar['date'], $data_calendar['end_time'] );
		// $date 				=  date_i18n( get_option('date_format'), $start_time ) . ': ' . date_i18n( get_option('time_format'), $start_time ) . ' - ' . date_i18n( get_option('time_format'), $end_time );

		// // Custom checkout field
		// $checkout_field 			= get_post_meta( $booking_id, OVA_METABOX_EVENT.'data_checkout_field', true );
		// $data_checkout_field 		= ! empty( $checkout_field ) ? json_decode( $checkout_field , true) : [];
		// $custom_fields_mail 		= '';
		// $list_ckf_output 			= get_option( 'ova_booking_form', array() );

		// if ( is_array( $list_ckf_output ) && ! empty( $list_ckf_output ) ) {
		// 	foreach ( $list_ckf_output as $key => $field ) {
		// 		if ( array_key_exists( $key, $data_checkout_field )  && array_key_exists( 'enabled', $field ) && $field['enabled'] == 'on' && $data_checkout_field[$key] ) {

		// 			$ckf_val = $data_checkout_field[$key];

		// 			if ( $field['type'] === 'select' ) {
		// 				$ova_options_key 	= $field['ova_options_key'];
		// 				$ova_options_text 	= $field['ova_options_text'];

		// 				if ( ! empty( $ova_options_key ) && is_array( $ova_options_key ) ) {
		// 					$op_k = array_search( $data_checkout_field[$key], $ova_options_key );

		// 					if ( ! is_bool( $op_k ) ) {
        //                         if ( isset( $ova_options_text[$op_k] ) && $ova_options_text[$op_k] ) {
        //                         	$ckf_val = $ova_options_text[$op_k];
        //                         }
        //                     }
		// 				}
		// 			}

		// 			if ( $field['type'] === 'radio' ) {
		// 				$ova_radio_key 	= $field['ova_radio_key'];
		// 				$ova_radio_text = $field['ova_radio_text'];

		// 				if ( ! empty( $ova_radio_key ) && is_array( $ova_radio_key ) ) {
		// 					$radio_k = array_search( $data_checkout_field[$key], $ova_radio_key );

		// 					if ( ! is_bool( $radio_k ) ) {
        //                         if ( isset( $ova_radio_text[$radio_k] ) && $ova_radio_text[$radio_k] ) {
        //                         	$ckf_val = $ova_radio_text[$radio_k];
        //                         }
        //                     }
		// 				}
		// 			}

		// 			if ( $field['type'] === 'checkbox' ) {
		// 				$ova_checkbox_key 	= $field['ova_checkbox_key'];
		// 				$ova_checkbox_text 	= $field['ova_checkbox_text'];
		// 				$ckf_val 			= [];

		// 				if ( ! empty( $ova_checkbox_key ) && is_array( $ova_checkbox_key ) ) {
		// 					$checkbox_args = explode( ', ', $data_checkout_field[$key] );

		// 					if ( ! empty( $checkbox_args ) && is_array( $checkbox_args ) ) {
		// 						foreach ( $checkbox_args as $checkbox_v ) {
		// 							$checkbox_k = array_search( $checkbox_v, $ova_checkbox_key );

		// 							if ( ! is_bool( $checkbox_k ) ) {
	    //                                 if ( isset( $ova_checkbox_text[$checkbox_k] ) && $ova_checkbox_text[$checkbox_k] ) {
	    //                                 	array_push( $ckf_val , $ova_checkbox_text[$checkbox_k] );
	    //                                 }
	    //                             }
		// 						}
		// 					}
		// 				}

		// 				$ckf_val = implode( ', ', $ckf_val );
		// 			}

		// 			if ( $field['type'] == 'file' ) {
		// 				$ckf_val = '<a href="'.esc_url( $ckf_val ).'" target="_blank">'.wp_basename( $ckf_val ).'</a>';
		// 			}

		// 			$custom_fields_mail .= $field['label'] .': '. $ckf_val .'<br/>';
		// 		}
		// 	}
		// }

		// $body_mail = str_replace( '&lt;br&gt;', "<br>", $body_mail );
		// $body_mail = str_replace( '[el_event]', $event_name . "<br>", $body_mail );
		// $body_mail = str_replace( '[el_booking_id]', $booking_id . "<br>", $body_mail );
		// $body_mail = str_replace( '[el_type_ticket]', $html_type_ticket . "<br>", $body_mail );
		// $body_mail = str_replace( '[el_name]', $name_customer . "<br>", $body_mail );
		// $body_mail = str_replace( '[el_phone]', $phone_customer . "<br>", $body_mail );
		// $body_mail = str_replace( '[el_email]', $email_customer . "<br>", $body_mail );
		// $body_mail = str_replace( '[el_address]', $address . "<br>", $body_mail );
		// $body_mail = str_replace( '[el_venue]', $venue . "<br>", $body_mail );
		// $body_mail = str_replace( '[el_date]', $date . "<br>", $body_mail );
		// $body_mail = str_replace( '[el_total]', $total_after_tax . "<br>", $body_mail );
		// $body_mail = str_replace( '[el_custom_fields]', $custom_fields_mail . "<br>", $body_mail );
		

		// // If Email Content is Empty
		// if ( ! $body_mail ) {
		// 	$body_mail = esc_html__('Name Event: ', 'eventlist').$event_name . "<br>";
		// 	$body_mail .= esc_html__('Booking ID: ', 'eventlist').$booking_id."<br>";
		// 	$body_mail .= esc_html__('Ticket Type: ', 'eventlist').$html_type_ticket."<br>";
		// 	$body_mail .= esc_html__('Name: ', 'eventlist').$name_customer."<br>";
		// 	$body_mail .= esc_html__('Phone: ', 'eventlist').$phone_customer."<br>";
		// 	$body_mail .= esc_html__('Email: ', 'eventlist').$email_customer."<br>";
		// 	$body_mail .= esc_html__('Address: ', 'eventlist').$address."<br>";
		// 	$body_mail .= esc_html__('Venue: ', 'eventlist').$venue."<br>";
		// 	$body_mail .= esc_html__('Date: ', 'eventlist').$date."<br>";
		// 	$body_mail .= esc_html__('Total: ', 'eventlist').$total_after_tax."<br>";
		// 	$body_mail .= $custom_fields_mail.'<br>';
		// }
		
		// $subject = $settings_mail->get('mail_new_vendor_subject', esc_html__("Book Ticket Success", 'eventlist') );

		// $result = true;

		// if ( ! empty( $mail_to ) ) {
		// 	if ( $order_status == 'hold' ) {
		// 		$list_ticket_pdf_png = [];	
		// 	} else {
		// 		$list_ticket_pdf_png = apply_filters( 'el_booking_mail_attachments', EL_Ticket::instance()->make_pdf_ticket_by_booking_id( $booking_id ) );
		// 	}

		// 	$result = el_sendmail_new_order( $mail_to, $subject, $body_mail, $list_ticket_pdf_png );

		// 	//unlink file
		// 	$total_ticket_pdf = count( $list_ticket_pdf_png );

		// 	if ( ! empty( $list_ticket_pdf_png ) && is_array( $list_ticket_pdf_png ) ) {
		// 		foreach ( $list_ticket_pdf_png as $key => $value ) {
		// 			if ( $key < $total_ticket_pdf ) {
		// 				if ( file_exists( $value ) ) unlink( $value );
		// 			} 
		// 		}
		// 	}
		// }

		// // Send mail to each customer
		// if ( $send_each_customer && $multiple_ticket === 'yes' ) {
		// 	$data_ticket = array(
		// 		'subject' 			=> $subject,
		// 		'event_name' 		=> $event_name,
		// 		'ticket_type' 		=> $list_name_ticket,
		// 		'seat_option' 		=> $seat_option,
		// 		'address' 			=> $address,
		// 		'venue' 			=> $venue,
		// 		'date' 				=> $date,
		// 		'total' 			=> $total_after_tax,
		// 		'custom_fields' 	=> $custom_fields_mail,
		// 	);

		// 	$result = el_sendmail_each_customer( $booking_id, $order_status, $data_ticket );
		// }

		// return $result;
	}
}

if ( ! function_exists( 'el_sendmail_each_customer' ) ) {
	function el_sendmail_each_customer( $booking_id = null, $order_status = '', $data = [] ) {
		if ( ! $booking_id ) return false;

		$result = false;

		$ticket_ids = get_post_meta( $booking_id, OVA_METABOX_EVENT.'record_ticket_ids', true );
		$multiple_ticket = get_post_meta( $booking_id, OVA_METABOX_EVENT.'multiple_ticket', true );

		if ( ! empty( $ticket_ids ) && is_array( $ticket_ids ) ) {
			foreach ( $ticket_ids as $ticket_id ) {

				$ticket_transfer = get_post_meta( $ticket_id, OVA_METABOX_EVENT.'transfer_status', true );

				if ( $ticket_transfer !== 'yes' ) {

					$ticket_type 		= '';
					$ticket_id_event 	= get_post_meta( $ticket_id, OVA_METABOX_EVENT.'ticket_id_event', true );

					if ( $data['seat_option'] != 'map' ) {
						if ( $ticket_id_event && isset( $data['ticket_type'][$ticket_id_event] ) ) {
							$ticket_type = $data['ticket_type'][$ticket_id_event];
						}
					} else {
						$ticket_type = get_post_meta( $ticket_id, OVA_METABOX_EVENT.'seat', true );	
					}

					if ( $multiple_ticket === 'yes' ) {
						$checkout_field = get_post_meta( $ticket_id, OVA_METABOX_EVENT.'data_checkout_field', true );
						$data_ckf 		= ! empty( $checkout_field ) ? json_decode( $checkout_field , true) : [];
						$list_ckf 		= get_option( 'ova_booking_form', array() );
						$html_ckf 		= '';

						if ( is_array( $list_ckf ) && ! empty( $list_ckf ) ) {
							foreach ( $list_ckf as $key => $field ) {
								if ( array_key_exists( $key, $data_ckf )  && array_key_exists( 'enabled', $field ) && $field['enabled'] == 'on' && $data_ckf[$key] ) {
									$ckf_val = $data_ckf[$key];

									if ( $field['type'] === 'select' ) {
										$ova_options_key 	= $field['ova_options_key'];
										$ova_options_text 	= $field['ova_options_text'];

										if ( ! empty( $ova_options_key ) && is_array( $ova_options_key ) ) {
											$op_k = array_search( $data_ckf[$key], $ova_options_key );

											if ( ! is_bool( $op_k ) ) {
												if ( isset( $ova_options_text[$op_k] ) && $ova_options_text[$op_k] ) {
													$ckf_val = $ova_options_text[$op_k];
												}
											}
										}
									}

									if ( $field['type'] === 'radio' ) {
										$ova_radio_key 	= $field['ova_radio_key'];
										$ova_radio_text = $field['ova_radio_text'];

										if ( ! empty( $ova_radio_key ) && is_array( $ova_radio_key ) ) {
											$radio_k = array_search( $data_ckf[$key], $ova_radio_key );

											if ( ! is_bool( $radio_k ) ) {
												if ( isset( $ova_radio_text[$radio_k] ) && $ova_radio_text[$radio_k] ) {
													$ckf_val = $ova_radio_text[$radio_k];
												}
											}
										}
									}

									if ( $field['type'] === 'checkbox' ) {
										$ova_checkbox_key 	= $field['ova_checkbox_key'];
										$ova_checkbox_text 	= $field['ova_checkbox_text'];
										$ckf_val 			= [];

										if ( ! empty( $ova_checkbox_key ) && is_array( $ova_checkbox_key ) ) {
											$checkbox_args = explode( ', ', $data_ckf[$key] );

											if ( ! empty( $checkbox_args ) && is_array( $checkbox_args ) ) {
												foreach ( $checkbox_args as $checkbox_v ) {
													$checkbox_k = array_search( $checkbox_v, $ova_checkbox_key );

													if ( ! is_bool( $checkbox_k ) ) {
														if ( isset( $ova_checkbox_text[$checkbox_k] ) && $ova_checkbox_text[$checkbox_k] ) {
															array_push( $ckf_val , $ova_checkbox_text[$checkbox_k] );
														}
													}
												}
											}
										}

										$ckf_val = implode( ', ', $ckf_val );
									}

									if ( $field['type'] == 'file' ) {
										$ckf_val = '<a href="'.esc_url( $ckf_val ).'" target="_blank">'.wp_basename( $ckf_val ).'</a>';
									}

									$html_ckf .= $field['label'] .': '. $ckf_val .'<br/>';
								}
							}
						}

						$data['custom_fields'] = $html_ckf;
					}

					$customer_name 		= get_post_meta( $ticket_id, OVA_METABOX_EVENT.'name_customer', true );
					$customer_phone 	= get_post_meta( $ticket_id, OVA_METABOX_EVENT.'phone_customer', true );
					$customer_email 	= get_post_meta( $ticket_id, OVA_METABOX_EVENT.'email_customer', true );

					$pdf_ticket = [];

					if ( $order_status == 'hold' ) {
						$pdf_ticket = [];	
					} else {
						$pdf_ticket = apply_filters( 'el_ticket_mail_attachments', EL_Ticket::instance()->make_pdf_ticket_by_booking_id( $booking_id, $ticket_id ), $booking_id, $ticket_id );
					}

					$body_mail = EL()->options->mail->get( 'email_template' );
					$body_mail = str_replace( '&lt;br&gt;', "<br>", $body_mail );
					$body_mail = str_replace( '[el_event]', $data['event_name'] . "<br>", $body_mail );
					$body_mail = str_replace( '[el_booking_id]', $booking_id . "<br>", $body_mail );
					$body_mail = str_replace( '[el_type_ticket]', $ticket_type . "<br>", $body_mail );
					$body_mail = str_replace( '[el_name]', $customer_name . "<br>", $body_mail );
					$body_mail = str_replace( '[el_phone]', $customer_phone . "<br>", $body_mail );
					$body_mail = str_replace( '[el_email]', $customer_email . "<br>", $body_mail );
					$body_mail = str_replace( '[el_address]', $data['address'] . "<br>", $body_mail );
					$body_mail = str_replace( '[el_venue]', $data['venue'] . "<br>", $body_mail );
					$body_mail = str_replace( '[el_date]', $data['date'] . "<br>", $body_mail );
					$body_mail = str_replace( '[el_total]', $data['total'] . "<br>", $body_mail );
					$body_mail = str_replace( '[el_custom_fields]', $data['custom_fields'] . "<br>", $body_mail );


					// If Email Content is Empty
					if ( ! $body_mail ) {
						$body_mail = esc_html__('Name Event: ', 'eventlist') . $data['event_name'] . "<br>";
						$body_mail .= esc_html__('Booking ID: ', 'eventlist') . $booking_id . "<br>";
						$body_mail .= esc_html__('Ticket Type: ', 'eventlist') . $ticket_type . "<br>";
						$body_mail .= esc_html__('Name: ', 'eventlist') .$customer_name . "<br>";
						$body_mail .= esc_html__('Phone: ', 'eventlist') . $customer_phone . "<br>";
						$body_mail .= esc_html__('Email: ', 'eventlist') . $customer_email . "<br>";
						$body_mail .= esc_html__('Address: ', 'eventlist') . $data['address'] . "<br>";
						$body_mail .= esc_html__('Venue: ', 'eventlist') . $data['venue'] . "<br>";
						$body_mail .= esc_html__('Date: ', 'eventlist') . $data['date'] . "<br>";
						$body_mail .= esc_html__('Total: ', 'eventlist') .  $data['total'] . "<br>";
						$body_mail .= $data['custom_fields'].'<br>';
					}

					$result = el_sendmail_new_order( $customer_email, $data['subject'], $body_mail, $pdf_ticket );

					//unlink file
					$total_ticket_pdf = count( $pdf_ticket );

					if ( ! empty( $pdf_ticket ) && is_array( $pdf_ticket ) ) {
						foreach ( $pdf_ticket as $key => $value ) {
							if ( $key < $total_ticket_pdf ) {
								if ( file_exists( $value ) ) unlink( $value );
							} 
						}
					}

					// End Send Mail
				}
			} /*endforeach*/
		}

		return $result;
	}
}

// Send mail new order
if ( ! function_exists('el_sendmail_new_order') ) {
	function el_sendmail_new_order ( $mail_to, $subject, $body, $attachments = array() ) {


		$headers[] = "MIME-Version: 1.0\r\n";
		$headers[] = "Content-Type: text/html; charset=".get_bloginfo( 'charset' )."\r\n";

		add_filter( 'wp_mail_from', 'el_wp_mail_from_new_order' );
		add_filter( 'wp_mail_from_name', 'el_wp_mail_from_name_new_order' );

		$headers = apply_filters( 'el_header_sendmail_new_order', $headers );
		$mail_to = apply_filters( 'el_mailto_sendmail_new_order', $mail_to );

		if( wp_mail( $mail_to, $subject, $body, $headers, $attachments ) ){
			$result = true;
		}else{
			$result = false;
		}

		remove_filter( 'wp_mail_from', 'el_wp_mail_from_new_order');
		remove_filter( 'wp_mail_from_name', 'el_wp_mail_from_name_new_order' );

		return $result;
	}
}

if ( ! function_exists( 'el_bcc_admin_email' ) ) {

	function el_bcc_admin_email( $headers ){
		$settings_mail 	= EL()->options->mail;
		$mail_cc_bcc 	= $settings_mail->get( 'mail_cc_bcc' );
		$admin_email 	= get_option('admin_email');

		if ( $mail_cc_bcc && $admin_email ) {
			$headers[] = 'Bcc: '.$admin_email ."\r\n";
		}

		return apply_filters( 'el_bcc_admin_email', $headers );
	}

	add_filter( 'el_header_sendmail_new_order', 'el_bcc_admin_email', 10, 1 );
}

if ( ! function_exists( 'el_cc_admin_email' ) ) {
	
	function el_cc_admin_email( $mail_to ){
		$settings_mail 	= EL()->options->mail;
		$mail_cc_bcc 	= $settings_mail->get( 'mail_cc_bcc', '' );
		$admin_email 	= get_option('admin_email');

		if ( ! $mail_cc_bcc && $admin_email ) {
			$mail_to .= ','.$admin_email;
		}

		return apply_filters( 'el_cc_admin_email', $mail_to );
	}

	add_filter( 'el_mailto_sendmail_new_order', 'el_cc_admin_email', 10, 1 );
}

function el_add_bcc_all_emails( $headers, $object_id, $object, $WC_Mail_Class ) {
	$settings_mail 	= EL()->options->mail;
	$mail_cc_bcc 	= $settings_mail->get( 'mail_cc_bcc' );
	$admin_email 	= get_option('admin_email');
	
	if ( in_array( $object_id, array( 'new_order', 'cancelled_order', 'failed_order' ), true ) ) {
		if ( $mail_cc_bcc && $admin_email ) {
			$headers = array( 
				$headers,
				'Bcc: '.$admin_email ."\r\n",
		    );
		}
	}
    
    return apply_filters( 'el_add_bcc_all_emails', $headers, $object_id, $object, $WC_Mail_Class );
}

// add_filter( 'woocommerce_email_headers', 'el_add_bcc_all_emails', 10, 4 );

function el_wp_mail_from_name_new_order() {
	return EL()->options->mail->get('mail_new_vendor_from_name', esc_html__("Book Ticket Success", 'eventlist') );
}

function el_wp_mail_from_new_order() {
	if ( EL()->options->mail->get('admin_email') ) {
		return EL()->options->mail->get('admin_email');
	} else {
		return get_option('admin_email');	
	}
}
/* ************************ End New Order **********************/

/**
 * New Event
 */
if ( ! function_exists('el_sendmail_create_event') ) {
	function el_sendmail_create_event ( $post_id ) {

		$headers = "MIME-Version: 1.0\r\n";
		$headers .= "Content-Type: text/html; charset=".get_bloginfo( 'charset' )."\r\n";

		add_filter( 'wp_mail_from', 'el_wp_mail_from_new_event' );
		add_filter( 'wp_mail_from_name', 'el_wp_mail_from_name_new_event' );

		$event = '<a href="'.esc_url( get_the_permalink( $post_id ) ).'">'.get_the_title( $post_id ).'</a>';
		

		// Mail To
		$mail_to = el_wp_mail_from_new_event();

		$mail_new_event_recipient = EL()->options->mail->get('mail_new_event_recipient');

		if( $mail_new_event_recipient ){
			$mail_to = $mail_to.','.$mail_new_event_recipient;
		}

		// Subject
		$subject = EL()->options->mail->get('mail_new_event_subject', esc_html__('New Event', 'eventlist') );

		// Body Mail
		$body_mail = EL()->options->mail->get('mail_new_event_content');

		if( !$body_mail ){
			$body_mail = 'A new event created: [el_event]';			
		}

		$body_mail = str_replace( '&lt;br&gt;', "<br>", $body_mail );
		$body_mail = str_replace( '[el_event]', $event, $body_mail );
		

		if( wp_mail( $mail_to, $subject, $body_mail, $headers ) ){
			$result = true;
		}else{
			$result = false;
		}

		remove_filter( 'wp_mail_from', 'el_wp_mail_from_new_event');
		remove_filter( 'wp_mail_from_name', 'el_wp_mail_from_name_new_event' );

		return $result;

	}
}

function el_wp_mail_from_new_event() {
	if ( EL()->options->mail->get('mail_new_event_send_from') ) {
		return EL()->options->mail->get('mail_new_event_send_from');
	} else {
		return get_option('admin_email');	
	}
}

function el_wp_mail_from_name_new_event(){
	return EL()->options->mail->get('mail_new_event_from_name', esc_html__('New Event', 'eventlist') );
}
/* ************************ End New Event **********************/

/**
 * Guest send mail to vendor
 */

if ( ! function_exists('el_custom_send_mail_vendor') ) {
	function el_custom_send_mail_vendor ( $email_client = '', $id_event = '', $subject = '', $body = '' ) {
		if( empty($id_event) || empty($email_client) ) return;

		$author_id_event = get_post_field("post_author", $id_event);
		$email_author = get_the_author_meta("email", $author_id_event);

		$email = apply_filters( 'mail_contact_vendor_send_client', true ) ? $email_author . ',' . $email_client : $email_author;

		$headers = "MIME-Version: 1.0\r\n";
		$headers .= "Content-Type: text/html; charset=".get_bloginfo( 'charset' )."\r\n";

		add_filter( 'wp_mail_from', 'el_wp_mail_from_single_event_mail_vendor' );
		add_filter( 'wp_mail_from_name', 'el_wp_mail_from_name_single_event_mail_vendor' );

		if( wp_mail( $email, $subject, $body, $headers ) ){
			$result = true;
		}else{
			$result = false;
		}

		remove_filter( 'wp_mail_from', 'el_wp_mail_from_single_event_mail_vendor');
		// remove_filter( 'wp_mail_from_name', function(){ return $subject; } );
		remove_filter( 'wp_mail_from_name', 'el_wp_mail_from_name_single_event_mail_vendor' );

		return $result;
	}
}

function el_wp_mail_from_single_event_mail_vendor() {
	if ( EL()->options->mail->get('admin_email_mail_vendor') ) {
		return EL()->options->mail->get('admin_email_mail_vendor');
	} else {
		return get_option('admin_email');	
	}
}

function el_wp_mail_from_name_single_event_mail_vendor() {
	return EL()->options->mail->get( 'mail_contact_vendor_from_name', esc_html__( "Contact Vendor", 'eventlist') );
}
/* ************************ End Guest send mail to Vendor **********************/

if ( ! function_exists('el_enable_send_withdrawal_email') ) {
	function el_enable_send_withdrawal_email(){
		if ( EL()->options->mail->get('enable_send_withdrawal_email','yes') === 'yes' ) {
			return true;
		} else {
			return false;
		}
	}
}

if ( ! function_exists('el_send_mail_admin_payout_request') ) {
	function el_send_mail_admin_payout_request( $vendor_id, $payout_id, $amount, $payment_method ){

		$vendor_data 		= get_user_by( 'ID', $vendor_id );
		$vendor_name 		= $vendor_data->display_name;
		$vendor_email 		= $vendor_data->user_email;
		$payout_edit_link 	= get_edit_post_link( $payout_id );
		$vendor_edit_link 	= get_edit_user_link( $vendor_id );
		$mail_to 			= el_wp_mail_from_payout_request();

		$subject = EL()->options->mail->get('mail_payout_request_from_name') ? EL()->options->mail->get('mail_payout_request_from_name') : __( 'Payout Request', 'eventlist' );

		$body = EL()->options->mail->get('payout_request_email_template');
		if ( ! $body ) {
			$body = 'Name: [el_name]<br/>Amount to withdraw: [el_amount]<br/>Payment Method: [el_payment_method]<br/>Payout ID: [el_payout]';
		}

		$body = str_replace( '&lt;br&gt;', "<br>", $body );
		$body = str_replace( '[el_name]', '<a href="'. esc_url( $vendor_edit_link ) .'">'. esc_html( $vendor_name ) .'</a>'.'<br>', $body);
		$body = str_replace( '[el_amount]', esc_html( $amount ) . '<br>', $body);
		$body = str_replace( '[el_payment_method]', esc_html( $payment_method ) . '<br>', $body);
		$body = str_replace( '[el_payout]', '<a href="'.esc_url( $payout_edit_link ).'">' .esc_html( $payout_id ) .'</a>' .'<br>', $body);

		$headers = "MIME-Version: 1.0\r\n";
		$headers .= "Content-Type: text/html; charset=".get_bloginfo( 'charset' )."\r\n";

		add_filter( 'wp_mail_from', function( $email ) {
			return $vendor_email;
		} );
		add_filter( 'wp_mail_from_name', function( $name ) {
			return $vendor_name;
		} );

		if ( wp_mail( $mail_to, $subject, $body, $headers ) ) {
			$result = true;
		} else {
			$result = false;
		}

		return $result;
	}
}

if ( ! function_exists('el_wp_mail_from_payout_request') ) {
    function el_wp_mail_from_payout_request() {
        if ( EL()->options->mail->get('admin_email_payout_request') ) {
            return EL()->options->mail->get('admin_email_payout_request');
            }
        }
    }

if ( ! function_exists('el_wp_mail_from_name_payout_request') ) {
	function el_wp_mail_from_name_payout_request(){
		EL()->options->mail->get('mail_payout_request_from_name') ? EL()->options->mail->get('mail_payout_request_from_name') : __( 'Request Withdraw', 'eventlist' );
	}
}

if ( ! function_exists('enable_send_payout_completed_email') ) {
	function enable_send_payout_completed_email(){
		if ( EL()->options->mail->get('enable_send_payout_completed_email','yes') === 'yes' ) {
			return true;
		} else {
			return false;
		}
	}
}

if ( ! function_exists('el_send_mail_vendor_payout_completed') ) {
	function el_send_mail_vendor_payout_completed( $vendor_id, $payout_id, $amount, $payment_method, $extra_info ){

		$vendor_data 		= get_user_by( 'ID', $vendor_id );
		$vendor_email 		= $vendor_data->user_email;

		$subject = EL()->options->mail->get('mail_payout_completed_from_name') ? EL()->options->mail->get('mail_payout_completed_from_name') : __( 'Payout Completed', 'eventlist' );

		$body = EL()->options->mail->get('payout_completed_email_template');
		if ( ! $body ) {
			$body = 'Payout ID: [el_payout]<br/>Amount to withdraw: [el_amount]<br/>Payout Method: [el_payout_method]<br/>Extra Info: [el_extra_info]';
		}

		$body = str_replace( '&lt;br&gt;', "<br>", $body );
		$body = str_replace( '[el_payout]', esc_html( $payout_id ) .'<br>', $body);
		$body = str_replace( '[el_amount]', esc_html( $amount ) . '<br>', $body);
		$body = str_replace( '[el_payout_method]', esc_html( $payment_method ) . '<br>', $body);
		$body = str_replace( '[el_extra_info]', esc_html( $extra_info ) . '<br>', $body);
		

		$headers = "MIME-Version: 1.0\r\n";
		$headers .= "Content-Type: text/html; charset=".get_bloginfo( 'charset' )."\r\n";

		add_filter( 'wp_mail_from', 'el_wp_mail_from_payout_completed' );
		add_filter( 'wp_mail_from_name', 'el_wp_mail_from_name_payout_completed' );

		if ( wp_mail( $vendor_email, $subject, $body, $headers ) ) {
			$result = true;
		} else {
			$result = false;
		}

		remove_filter( 'wp_mail_from', 'el_wp_mail_from_payout_completed' );
		remove_filter( 'wp_mail_from_name', 'el_wp_mail_from_name_payout_completed' );

		return $result;
	}
}

if ( ! function_exists('el_wp_mail_from_payout_completed') ) {
	function el_wp_mail_from_payout_completed() {
		if ( EL()->options->mail->get('admin_email_payout_completed') ) {
			return EL()->options->mail->get('admin_email_payout_completed');
		} else {
			return get_option('admin_email');	
		}
	}
}

if ( ! function_exists('el_wp_mail_from_name_payout_completed') ) {
	function el_wp_mail_from_name_payout_completed(){
		EL()->options->mail->get('mail_payout_completed_from_name') ? EL()->options->mail->get('mail_payout_completed_from_name') : __( 'Payout Completed', 'eventlist' );
	}
}

if ( ! function_exists('enable_send_payout_canceled_email') ) {
	function enable_send_payout_canceled_email(){
		if ( EL()->options->mail->get('enable_send_payout_canceled_email','yes') === 'yes' ) {
			return true;
		} else {
			return false;
		}
	}
}

if ( ! function_exists('el_send_mail_vendor_payout_canceled') ) {
	function el_send_mail_vendor_payout_canceled( $vendor_id, $payout_id, $amount, $payment_method, $extra_info ){

		$vendor_data 		= get_user_by( 'ID', $vendor_id );
		$vendor_email 		= $vendor_data->user_email;

		$subject = EL()->options->mail->get('mail_payout_canceled_from_name') ? EL()->options->mail->get('mail_payout_canceled_from_name') : __( 'Payout Canceled', 'eventlist' );

		$body = EL()->options->mail->get('payout_canceled_email_template');
		if ( ! $body ) {
			$body = 'Payout ID: [el_payout]<br/>Amount to withdraw: [el_amount]<br/>Payout Method: [el_payout_method]<br/>Extra Info: [el_extra_info]';
		}

		$body = str_replace( '&lt;br&gt;', "<br>", $body );
		$body = str_replace( '[el_payout]', esc_html( $payout_id ) .'<br>', $body);
		$body = str_replace( '[el_amount]', esc_html( $amount ) . '<br>', $body);
		$body = str_replace( '[el_payout_method]', esc_html( $payment_method ) . '<br>', $body);
		$body = str_replace( '[el_extra_info]', esc_html( $extra_info ) . '<br>', $body);
		

		$headers = "MIME-Version: 1.0\r\n";
		$headers .= "Content-Type: text/html; charset=".get_bloginfo( 'charset' )."\r\n";

		add_filter( 'wp_mail_from', 'el_wp_mail_from_payout_canceled' );
		add_filter( 'wp_mail_from_name', 'el_wp_mail_from_name_payout_canceled' );

		if ( wp_mail( $vendor_email, $subject, $body, $headers ) ) {
			$result = true;
		} else {
			$result = false;
		}

		remove_filter( 'wp_mail_from', 'el_wp_mail_from_payout_canceled' );
		remove_filter( 'wp_mail_from_name', 'el_wp_mail_from_name_payout_canceled' );

		return $result;
	}
}

if ( ! function_exists('el_wp_mail_from_payout_canceled') ) {
	function el_wp_mail_from_payout_canceled() {
		if ( EL()->options->mail->get('admin_email_payout_canceled') ) {
			return EL()->options->mail->get('admin_email_payout_canceled');
		} else {
			return get_option('admin_email');	
		}
	}
}

if ( ! function_exists('el_wp_mail_from_name_payout_canceled') ) {
	function el_wp_mail_from_name_payout_canceled(){
		EL()->options->mail->get('mail_payout_canceled_from_name') ? EL()->options->mail->get('mail_payout_canceled_from_name') : __( 'Payout Canceled', 'eventlist' );
	}
}


/**
 * New Report Event
 */
if ( ! function_exists('el_submit_sendmail_report') ) {
	function el_submit_sendmail_report ( $id_event, $subject = '', $body = '' ) {
		// Mail To
		$mail_to = el_wp_mail_from_single_event_report();

		$mail_report_event_recipient = EL()->options->mail->get('mail_report_event_recipient');

		if( $mail_report_event_recipient ){
			$mail_to = $mail_to.','.$mail_report_event_recipient;
		}
		
		if( empty($id_event) ) return;

		$headers = "MIME-Version: 1.0\r\n";
		$headers .= "Content-Type: text/html; charset=".get_bloginfo( 'charset' )."\r\n";

		add_filter( 'wp_mail_from', 'el_wp_mail_from_single_event_report' );
		add_filter( 'wp_mail_from_name', 'el_wp_mail_from_name_single_event_report' );


		if( wp_mail( $mail_to, $subject, $body, $headers ) ){
			$result = true;
		}else{
			$result = false;
		}

		remove_filter( 'wp_mail_from', 'el_wp_mail_from_single_event_report');
		remove_filter( 'wp_mail_from_name', 'el_wp_mail_from_name_single_event_report' );

		return $result;
	}
}

function el_wp_mail_from_single_event_report() {
	if ( EL()->options->mail->get('mail_report_event_send_from_email') ) {
		return EL()->options->mail->get('mail_report_event_send_from_email');
	} else {
		return get_option('admin_email');	
	}
}

function el_wp_mail_from_name_single_event_report() {
	return EL()->options->mail->get( 'mail_report_event_from_name', esc_html__( "Report event", 'eventlist') );
}
/* ************************ End New Report Event **********************/

/**
 * Remind customer event start time
 */
function el_mail_remind_event_time( $mail_to, $event_id, $event_name, $event_start_time ) {
	$subject = EL()->options->mail->get( 'mail_remind_time_subject', esc_html__( "Remind event start time", 'eventlist') );

	$body = EL()->options->mail->get( 'mail_remind_time_template', esc_html__( "You registered event: [el_event_name] at [el_event_start_time]", 'eventlist') );

	$body = str_replace( '&lt;br&gt;', "<br>", $body );
	$body = str_replace('[el_event_name]', '<a href="'.get_permalink($event_id).'">'.$event_name.'</a>', $body);
	$body = str_replace('[el_event_start_time]', $event_start_time, $body);


	$headers = "MIME-Version: 1.0\r\n";
	$headers .= "Content-Type: text/html; charset=".get_bloginfo( 'charset' )."\r\n";

	add_filter( 'wp_mail_from', 'el_mail_sendfrom_remind_time' );
	add_filter( 'wp_mail_from_name', 'el_mail_remind_time_from_name' );


	if( wp_mail( $mail_to, $subject, $body, $headers ) ){
		$result = true;
	}else{
		$result = false;
	}

	remove_filter( 'wp_mail_from', 'el_mail_sendfrom_remind_time');
	remove_filter( 'wp_mail_from_name', 'el_mail_remind_time_from_name' );

	return $result;
}

function el_mail_sendfrom_remind_time() {
	if ( EL()->options->mail->get('mail_sendfrom_remind_time') ) {
		return EL()->options->mail->get('mail_sendfrom_remind_time');
	} else {
		return get_option('admin_email');	
	}
}

function el_mail_remind_time_from_name() {
	return EL()->options->mail->get( 'mail_remind_time_from_name', esc_html__( "Remind event start time", 'eventlist') );
}

/**
 * Cancel Booking mail
 */
if ( EL()->options->mail->get( 'cancel_mail_enable', 'yes' ) ) {
	add_action( 'el_cancel_booking_succesfully', 'el_mail_cancel_booking', 10, 1 );
}

function el_mail_cancel_booking( $booking_id ) {
	$mails_to = array();
	// Admin email
	if( apply_filters( 'el_mail_cancel_booking_re_admin', true ) ){
		$mails_to[] = get_option('admin_email');
	}
	// Customer email
	$mails_to[] = get_post_meta( $booking_id, OVA_METABOX_EVENT.'email', true );

	// Vendor email
	$id_event = get_post_meta( $booking_id, OVA_METABOX_EVENT.'id_event', true );
	$vendor_id = get_post_field( 'post_author', $id_event );
	$mails_to[] = get_the_author_meta( 'user_email', $vendor_id );


	$mail_to = implode( ',', $mails_to );

	$subject = EL()->options->mail->get( 'mail_cancel_booking_time_subject', esc_html__( "Cancel Booking", 'eventlist') );

	$body = EL()->options->mail->get( 'mail_cancel_booking_template', esc_html__( "Cancel Booking #[booking_id] Successfully", 'eventlist') );

	// Title Event
	$title_event = get_post_meta( $booking_id, OVA_METABOX_EVENT.'title_event', true );
	$event_link = get_the_permalink( $id_event );

	// Event Date
	$id_calendar = get_post_meta( $booking_id, OVA_METABOX_EVENT.'id_cal', true );

	$data_calendar = el_get_calendar_core( $id_event,  $id_calendar );
	$start_time = el_get_time_int_by_date_and_hour($data_calendar['date'], $data_calendar['start_time']);
	$end_time = el_get_time_int_by_date_and_hour($data_calendar['date'], $data_calendar['end_time']);

	$date =  date_i18n(get_option('date_format'), $start_time) . ': ' . date_i18n(get_option('time_format'), $start_time) . ' - ' . date_i18n(get_option('time_format'), $end_time);
	

	$body = str_replace( '&lt;br&gt;', "<br>", $body );
	$body = str_replace('[booking_id]', $booking_id, $body);
	$body = str_replace('[event_name]', '<a href="'.$event_link.'">'.$title_event.'</a>', $body);
	$body = str_replace('[event_date]', $date, $body);
	
	
	$headers = "MIME-Version: 1.0\r\n";
	$headers .= "Content-Type: text/html; charset=".get_bloginfo( 'charset' )."\r\n";

	add_filter( 'wp_mail_from', 'el_mail_sendfrom_cancel_booking' );
	add_filter( 'wp_mail_from_name', 'el_mail_cancel_booking_from_name' );


	if( wp_mail( $mail_to, $subject, $body, $headers ) ){
		$result = true;
	}else{
		$result = false;
	}

	remove_filter( 'wp_mail_from', 'el_mail_sendfrom_cancel_booking');
	remove_filter( 'wp_mail_from_name', 'el_mail_cancel_booking_from_name' );

	return $result;
}

function el_mail_sendfrom_cancel_booking() {
	if ( EL()->options->mail->get('mail_sendfrom_cancel_booking') ) {
		return EL()->options->mail->get('mail_sendfrom_cancel_booking');
	} else {
		return get_option('admin_email');	
	}
}

function el_mail_cancel_booking_from_name() {
	return EL()->options->mail->get( 'mail_cancel_booking_from_name', esc_html__( "Cancel Booking", 'eventlist') );
}	

/**
 * Reset Password
 */
function el_mail_reset_password( $user_id ) {

	$user = new WP_User( (int) $user_id );
					
	$adt_rp_key = get_password_reset_key( $user );
	$user_login = $user->user_login;
	$rp_link = '<a href="' . network_site_url("wp-login.php?action=rp&key=$adt_rp_key&login=" . rawurlencode($user_login), 'login') . '">' . network_site_url("wp-login.php?action=rp&key=$adt_rp_key&login=" . rawurlencode($user_login), 'login') . '</a>';

	$mail_to = $user->user_email;

	$subject = esc_html__( "Reset Password", 'eventlist');
	$body = sprintf( esc_html__( 'You created an account at %s, click link to reset password: %s', 'eventlist' ), home_url('/'), $rp_link );

	$headers = "MIME-Version: 1.0\r\n";
	$headers .= "Content-Type: text/html; charset=".get_bloginfo( 'charset' )."\r\n";

	add_filter( 'wp_mail_from', 'el_mail_sendfrom_reset_password' );
	add_filter( 'wp_mail_from_name', 'el_mail_fromname_reset_password' );


	if( wp_mail( $mail_to, $subject, $body, $headers ) ){
		$result = true;
	}else{
		$result = false;
	}

	remove_filter( 'wp_mail_from', 'el_mail_sendfrom_reset_password');
	remove_filter( 'wp_mail_from_name', 'el_mail_fromname_reset_password' );

	return $result;
}

function el_mail_sendfrom_reset_password() {
	if ( EL()->options->mail->get('admin_email') ) {
		return EL()->options->mail->get('admin_email');
	} else {
		return get_option('admin_email');	
	}
}

function el_mail_fromname_reset_password() {
	return esc_html__( "Reset Password", 'eventlist');
}

// Ticket replace date - Send mail 
if ( ! function_exists('el_ticket_replace_date_send_mail') ) {
	function el_ticket_replace_date_send_mail ( $mail_to, $mail_from, $subject, $form_name, $body ) {
		$headers = "MIME-Version: 1.0\r\n";
		$headers .= "Content-Type: text/html; charset=".get_bloginfo( 'charset' )."\r\n";

		add_filter( 'wp_mail_from', function( $mail_from ) { return $mail_from; } );
		add_filter( 'wp_mail_from_name', function( $from_name ) { return $from_name; } );

		if ( wp_mail( $mail_to, $subject, $body, $headers ) ) {
			$result = true;
		} else {
			$result = false;
		}

		return $result;
	}
}
// End

// Send PDF Invoice
if ( ! function_exists( 'el_sendmail_pdf_invoice' ) ) {
	function el_sendmail_pdf_invoice( $booking_id, $pdf_url ) {
		if ( ! $booking_id || ! $pdf_url ) return;
		$result = false;

		$body_mail 	= EL()->options->invoice->get( 'invoice_mail_content' );
		$body_mail = str_replace( '&lt;br&gt;', "<br>", $body_mail );
		$body_mail = str_replace( '[booking_id]', $booking_id . "<br>", $body_mail );

		if ( ! $body_mail ) {
			$body_mail = 'Invoice for booking: #'.$booking_id.'<br>';
		}

		$mail_to 	= get_post_meta( $booking_id, OVA_METABOX_EVENT.'email', true );
		$subject 	= EL()->options->invoice->get( 'invoice_mail_subject', esc_html__('Booking Invoice'. 'eventlist') );

		$headers = "MIME-Version: 1.0\r\n";
		$headers .= "Content-Type: text/html; charset=".get_bloginfo( 'charset' )."\r\n";

		add_filter( 'wp_mail_from', 'el_wp_mail_from_invoice' );
		add_filter( 'wp_mail_from_name', 'el_wp_mail_from_name_invoice' );

		if ( wp_mail( $mail_to, $subject, $body_mail, $headers, array( $pdf_url ) ) ) {
			$result = true;
		}

		remove_filter( 'wp_mail_from', 'el_wp_mail_from_invoice');
		remove_filter( 'wp_mail_from_name', 'el_wp_mail_from_name_invoice' );

		if ( file_exists( $pdf_url ) ) unlink( $pdf_url );

		return $result;
	}
}

if ( ! function_exists( 'el_wp_mail_from_invoice' ) ) {
	function el_wp_mail_from_invoice() {
		if ( EL()->options->invoice->get('invoice_mail_from_email') ) {
			return EL()->options->invoice->get('invoice_mail_from_email');
		} else {
			return get_option('admin_email');	
		}
	}
}

if ( ! function_exists( 'el_wp_mail_from_name_invoice' ) ) {
	function el_wp_mail_from_name_invoice() {
		return EL()->options->invoice->get( 'invoice_mail_from_name', esc_html__("Booking Invoice", 'eventlist') );
	}
}
/* Send mail to user when password changed */
if ( ! function_exists('el_sendmail_password_changed') ) {
	
	function el_sendmail_password_changed( $password, $user_id ){

		$user = get_user_by( 'ID', $user_id );
		$mail_to = $user->user_email;
		$subject = __( 'Your password was changed', 'eventlist' );
		$args = array();
		$key = get_password_reset_key( $user );
		$url = network_site_url( "wp-login.php?action=rp&key=$key&login=" . rawurlencode( $user->user_login ), 'login' );
		$args['url'] = $url;

		ob_start();
		el_get_template('email/password_changed.php', $args );
		$body = ob_get_contents();
		ob_end_clean();

		$headers = "MIME-Version: 1.0\r\n";
		$headers .= "Content-Type: text/html; charset=".get_bloginfo( 'charset' )."\r\n";

		add_filter( 'wp_mail_from', 'el_wp_mail_from_password_changed' );
		add_filter( 'wp_mail_from_name', 'el_wp_mail_from_name_password_changed' );

		wp_mail( $mail_to, $subject, $body, $headers );

		remove_filter( 'wp_mail_from', 'el_wp_mail_from_password_changed' );
		remove_filter( 'wp_mail_from_name', 'el_wp_mail_from_name_password_changed' );
	}

	add_action( 'wp_set_password', 'el_sendmail_password_changed', 20, 2 );
}

if ( ! function_exists('el_wp_mail_from_name_password_changed') ) {
	function el_wp_mail_from_name_password_changed(){
		return get_bloginfo( 'name' );
	}
}

if ( ! function_exists('el_wp_mail_from_password_changed') ) {
	function el_wp_mail_from_password_changed(){
		return get_option('admin_email');
	}
}