<script lang="ts">
    import type { SeatType, Ticket, TicketMapType } from "$lib/types";
  import QrCode from "../../../../components/QrCode.svelte";
  import moment from "moment";
  export let data;
  const { tickets, bookingId, event } = data;
  console.log(data);

</script>

{#each tickets as ticket, i}
  <div class="wrapper avoidInnerBreak">
    <div class="col1">
      <div class="logoWrap">
        <img src="/LOGO-A.svg" alt="logo" width="160" height="auto" />
      </div>
      <div class="content">
        <p>Evento (ID): <b>{ticket.eventId}</b></p>
        <p>Lugar: <b>{ticket.venue}</b></p>
        <p>Asiento: <b>{ticket.seat}</b></p>
        <p>Ticket (ID): <b>{ticket.ticketId}</b></p>
      </div>
    </div>

    <div class="col2">
      <div class="mainInfo">
        <h3>{ticket.eventName}</h3>
        <p><b>{ticket.venue}</b></p>
        <p>
          <b>
            {moment(new Date(ticket.eventStart * 1000)).format("DD/MM/yyyy")}
          </b>
        </p>
      </div>
      <div class="content">
        <p><b>Asiento: </b>{ticket.seat}</p>
      </div>
      <QrCode text={ticket.qrCode} />

      <p class="legalText">
        Este boleto solo permite la entrada al evento especificado, válido solo
        para la fecha, hora y evento señalado que aparece en el presente boleto.
        El titular debe portarlo durante su permanencia en el evento o recinto.
        Ocupar la seccion mencionada y mostrarlo al personal autorizado en caso
        del ser requerido. Si el evento se realiza no habrá reembolso alguno por
        boletos no utilizados, perdidos o robados, con raspaduras o
        enmendaduras. "Todos los eventos estan sujetos a cargos por servicio
        adicional al precio del boleto"
      </p>
    </div>
  </div>
{/each}

<style>
  :global(html, body) {
    font-family: sans-serif;
  }

  p {
    margin: 0;
    padding: 0;
    font-size: 10px;
  }

  .wrapper {
    display: flex;
    width: 100%;
  }

  .col1 {
    width: 25%;
    border-right: 1px solid #000;
  }

  .col1 .logoWrap {
    display: block;
    margin: auto;
    width: 117px;
    height: 170px;
  }

  .col1 img {
    margin-top: 40px;
    margin-left: -23px;
    transform: rotate(-90deg);
  }

  .col1 .content {
    text-align: center;
    padding-bottom: 10px;
    padding-top: 10px;
    text-transform: uppercase;
  }

  .col2 {
    width: 75%;
    height: 100%;
    padding: 10px;
    padding-bottom: 0;
    text-align: center;
  }

  .col2 .legalText {
    padding-top: 5px;
    font-size: 8px;
    text-align: left;
  }

  .col2 h3 {
    margin: 0;
    margin-bottom: 2px;
  }

  .col2 .mainInfo p {
    font-size: 13px;
    text-transform: uppercase;
  }

  .col2 .content {
    padding-top: 10px;
    padding-bottom: 10px;
  }

  @media screen {
    :global(.forPrint) {
      display: none;
    }
    .forScreen {
      display: block;
    }
  }

  @media print {
    @page {
      /* size: A5 landscape; */
      size: 279.4mm 76mm;
      margin: 5mm 5mm 5mm 5mm;
      print-color-adjust: exact;
    }

    :global(.avoidInnerBreak) {
      page-break-inside: avoid;
    }

    :global(.alwaysAfterBreak) {
      page-break-after: always;
    }
    :global(.forPrint) {
      display: block;
    }
    .forScreen {
      display: none;
    }
  }
</style>
