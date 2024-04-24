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
  <div class="page avoidInnerBreak">
    <div class="header">
      <img
        src="/flash_black_on_green.png"
        alt="logo"
        width="140"
        height="auto"
      />
    </div>

    <div class="content">
      <div class="banner">
        <img src={`/events/${ticket.eventId}/eTickets/background.jpg`} alt="banner" />
      </div>

      <div class="description">
        <div class="top">
          <div class="col1">
            <h3>{ticket.eventName}</h3>
            <p class="date">
              {moment(new Date(ticket.eventStart * 1000)).format(
                "DD / MM / yyyy HH:mm"
              )}
            </p>
          </div>
          <div class="col2">
            <img src="/marker.png" alt="marker" width="30" height="auto" />
            <div>
              <p class="venue">
                {ticket.venue || ""}
              </p>
              <p class="smallText">{ticket.address || ""}</p>
            </div>
          </div>
        </div>
        <div class="bottom">
          <p>ID reserva<b>{ticket.bookingId}</b></p>
          {#if mappedSeat.seat}
            <p>Asiento<b>{mappedSeat.seat}</b></p>
          {/if}
          {#if mappedSeat.section}
            <p>Sección<b>{mappedSeat.section}</b></p>
          {/if}
          {#if mappedSeat.seatType}
            <p>Zona<b>{mappedSeat.seatType}</b></p>
          {/if}
        </div>
      </div>
    </div>

    <div class="footer">
      <div class="legal">
        Este boleto solo permite la entrada al evento especificado. Válido sólo
        para la fecha, hora y evento señalado que aparece en el presente boleto.
        El titular debe portarlo durante su permanencia en el evento o recinto.
        Ocupar la sección mencionada y mostrarlo al personal autorizado en caso
        de ser requerido. Si el evento se realiza no habrá reembolso alguno por
        boletos no utilizados, perdidos, robados, con rapsaduras o enmendaduras.
        “Todos los eventos están sujetos a cargos por servicios adicional al
        precio del boleto”
      </div>
      <div class="qr">
        <QrCode text={ticket.qrCode} width={244} colorLight="#81E985" />
        <p class="">Ticket ID: <b>{ticket.ticketId}</b></p>
      </div>
      <div class="logo">
        <img src="/flash_icono_negro.png" alt="logo" width="40" height="auto" />
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
  .page {
    width: 210mm;
    height: 297mm;
    margin: auto;
  }

  .header {
    height: 30mm;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #81e985;
  }

  .content {
    background: #000;
    height: 157mm;
    border-bottom: 5px dashed #81e985;
  }

  .content .banner {
    height: 320px;
    overflow: hidden;
  }

  .content .banner img {
    width: auto;
    height: 100%;
    margin: 0 auto;
  }

  .content .description {
    padding: 30px 40px;
    font-size: 20px;
    font-weight: 400;
    line-height: 1;
    color: #fff;
  }

  .content .top {
    width: 100%;
    display: flex;
  }

  .content .top .col1 {
    width: 65%;
    padding-right: 45px;
  }
  .content .top .col2 {
    display: flex;
    align-items: flex-start;
    width: 70%;
  }

  .content .top .col2 img {
    margin-top: 3px;
  }

  .content .top .col2 div {
    padding-left: 10px;
  }

  .content .top .col2 p.venue {
    text-transform: uppercase;
    line-height: 1;
    font-size: 20px;
    padding-bottom: 5px;
  }

  .content .top .col2 p.smallText {
    line-height: 1;
  }

  .content .top h3 {
    text-transform: uppercase;
    font-size: 30px;
    font-weight: 700;
    line-height: 1;
    margin-bottom: 5px;
    color: #81e985;
  }

  .content .bottom {
    color: #81e985;
  }

  .content .bottom {
    display: flex;
    flex-wrap: wrap;
    padding-top: 20px;
  }

  .content .bottom p {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-size: 18px;
    text-transform: uppercase;
    padding: 15px;
  }

  .content .bottom p b {
    margin-top: 5px;
    background: #81e985;
    color: #000;
    font-weight: 700;
    font-size: 18px;
    text-transform: uppercase;
    padding: 10px;
    border-radius: 10px;
  }

  .footer {
    display: flex;
    flex-wrap: wrap;
    height: 100mm;
    width: 100%;
    padding: 45px;
  }

  .footer .legal {
    width: 65%;
    padding-right: 45px;
    text-align: justify;
    font-size: 17px;
    line-height: 1.5;
    color: #606060;
  }

  .footer .qr {
    width: 35%;
    margin: 0;
    padding: 0;
  }

  .footer .qr p {
    color: #000;
    margin-top: 10px;
    text-align: center;
    border-radius: 20px;
    padding-top: 6px;
    padding-bottom: 6px;
    font-size: 17px;
    font-weight: 700;
    line-height: 1;
    background: #81e985;
    text-transform: uppercase;
  }

  .footer .logo {
    width: 100%;
    text-align: center;
    padding-top: 10px;
  }
  .footer .logo img {
    display: block;
    margin-top: 0;
    margin-bottom: 0;
    padding: 0;
    margin-left: auto;
    margin-right: auto;
  }
  .smallText {
    font-size: 12px;
  }

  @page {
    /* size: A4 portrait; */
    size: A4 portrait;
    margin: 0;
    padding: 0;
    print-color-adjust: exact;
  }

  :global(.avoidInnerBreak) {
    page-break-inside: avoid;
  }

  :global(.alwaysAfterBreak) {
    page-break-after: always;
  }
</style>
