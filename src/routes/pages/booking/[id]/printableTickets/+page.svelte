<script lang="ts">
  import "@fontsource/source-sans-pro/400.css";
  import "@fontsource/source-sans-pro/700.css";
  import QrCode from "../../../../../components/QrCode.svelte";
  import moment from "moment";
  import { getSeatMap } from "$lib/client-util";

  export let data;
  const { tickets, bookingId, event } = data;
  console.log(data);
</script>

{#each tickets || [] as ticket, i}
  {@const mappedSeat = getSeatMap(ticket.seat)}
  <div class="wrapper avoidInnerBreak">
    <!-- col 1 -->
    <div class="col1">
      <img src="/flash_black_on_green_rotated.png" alt="logo" />
    </div>

    <!-- col 2 -->
    <div class="col2">
      <div class="col2Wrap">
        <div class="left">
          <div class="mainInfo">
            <!-- <h3>{ticket.eventName}</h3> -->
            <img class="eventImage" src={`/printableTickets/${ticket.eventId}/logo.jpg`} alt="event" />
            <p>
              <b>
                {moment(new Date(ticket.eventStart * 1000)).format(
                  "DD/MM/yyyy"
                )}
              </b>
            </p>
            <p class="address">
              {ticket.venue}
              <span class="smallText">{ticket.address || ""}</span>
            </p>
          </div>

          <div class="seatInfo">
            <p><b><i>Reserva: </i></b>{ticket.bookingId}</p>
            {#if mappedSeat.seat}
              <p><b><i>Asiento: </i></b>{mappedSeat.seat}</p>
            {/if}
            {#if mappedSeat.section}
              <p><b><i>Sección: </i></b>{mappedSeat.section}</p>
            {/if}
            {#if mappedSeat.seatType}
              <p><b><i>Zona: </i></b>{mappedSeat.seatType}</p>
            {/if}
          </div>
        </div>

        <div class="right">
          <QrCode text={ticket.qrCode} width={100} />
        </div>
      </div>
    </div>

    <!-- col 3 -->
    <div class="col3">
      <div class="content">
        <div class="seatInfo">
          <p><b><i>Reserva: </i></b>{ticket.bookingId}</p>
          {#if mappedSeat.seat}
            <p><b><i>Asiento: </i></b>{mappedSeat.seat}</p>
          {/if}
          {#if mappedSeat.section}
            <p><b><i>Sección: </i></b>{mappedSeat.section}</p>
          {/if}
          {#if mappedSeat.seatType}
            <p><b><i>Zona: </i></b>{mappedSeat.seatType}</p>
          {/if}
        </div>
        <p class="legalText">
          Este boleto solo permite la entrada al evento especificado, válido
          solo para la fecha, hora y evento señalado que aparece en el presente
          boleto. El titular debe portarlo durante su permanencia en el evento o
          recinto. Ocupar la seccion mencionada y mostrarlo al personal
          autorizado en caso del ser requerido. Si el evento se realiza no habrá
          reembolso alguno por boletos no utilizados, perdidos o robados, con
          raspaduras o enmendaduras. "Todos los eventos estan sujetos a cargos
          por servicio adicional al precio del boleto"
        </p>
      </div>
    </div>
  </div>
{/each}

<style>
  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }
  :global(html, body) {
    font-family: sans-serif;
    print-color-adjust: exact;
    box-sizing: border-box;
    font-family: "Source Sans Pro";
    font-weight: 400;
  }
  p {
    margin: 0;
    padding: 0;
    line-height: 1;
  }

  .wrapper {
    display: flex;
    size: 140mm 50mm;
  }

  .col1 {
    width: 25mm;
    height: 50mm;
  }

  .col1 img {
    width: 25mm;
    height: 50mm;
  }

  .col2 {
    width: 90mm;
    height: 50mm;
  }

  .col2Wrap {
    display: flex;
  }

  .col2Wrap .left {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    align-self: center;
    width: 65mm;
    height: 50mm;
    padding: 3mm;
    font-size: 13px;
  }

  .col2Wrap .right {
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    align-self: flex-end;
    width: 35mm;
    padding-bottom: 2mm;
    padding-right: 2mm;
  }

  .col2 .seatInfo {
    padding-top: 2mm;
    display: flex;
    flex-wrap: wrap;
  }

  .col2 .seatInfo p {
    padding-right: 10px;
    padding-bottom: 3px;
  }

  .col2 .seatInfo p b {
    padding-right: 3px;
  }

  .col2 .address .smallText {
    display: block;
    font-size: 10px;
  }

  .col2 .mainInfo {
    width: 100%;
  }

  .col2 .mainInfo h3 {
    text-transform: uppercase;
    font-weight: 700;
    line-height: 1;
    font-size: 19px;
    margin-bottom: 2mm;
  }

  .col2 .mainInfo .eventImage {
    width: 40mm;
    height: auto;
    margin-bottom: 2mm;
  }

  .col3 {
    width: 25mm;
    height: 50mm;
    border-left: 1px dashed #000;
  }

  .col3 .content {
    height: 25mm;
    width: 50mm;
    padding: 4mm;
    transform-origin: bottom right;
    transform: rotate(-90deg);
    display: flex;
    align-items: center;
    transform-origin: bottom;
  }

  .col3 .seatInfo {
    width: 24mm;
    font-size: 9px;
  }

  .col3 .seatInfo p {
    line-height: 1.3;
  }

  .col3 .seatInfo p b {
    padding-right: 3px;
  }

  .legalText {
    width: 26mm;
    font-size: 5px;
    line-height: 1;
    text-align: justify;
  }

  @media print {
    @page {
      size: 140mm 50mm;
      margin: 0;
      print-color-adjust: exact;
    }
  }

  :global(.avoidInnerBreak) {
    page-break-inside: avoid;
  }

  :global(.alwaysAfterBreak) {
    page-break-after: always;
  }
</style>
