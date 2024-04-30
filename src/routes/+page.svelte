<script lang="ts">
    import type { SeatType, Ticket, TicketMapType } from "$lib/types";
  import QrCode from "../components/QrCode.svelte";
  import moment from "moment";
  export let data;
//   let tickets = [
//     {
//       eventId: 15701,
//       img: 14999,
//       eventStart: 1722456000,
//       eventEnd: 1722469500,
//       eventName: "EVENTO PRUEBA DEL NUEVO NOMBRE",
//       qrCode: "8c94da999fbd445baa215f8ea650c89f",
//       customer: {
//         name: "Internal",
//         phone: "1234",
//         email: "abcd@foo.com",
//         address: "Internal address",
//       },
//       venue: "Palacio Blanco",
//       seat: "AZUL-VIP-SECC-C3-ASTO-JJ18",
//       ticketId: 16411,
//     },
//     {
//       eventId: 15701,
//       img: 14999,
//       eventStart: 1722456000,
//       eventEnd: 1722469500,
//       eventName: "EVENTO PRUEBA DEL NUEVO NOMBRE",
//       qrCode: "5586a87843304ff890cfefb6c86c6609",
//       customer: {
//         name: "Internal",
//         phone: "1234",
//         email: "abcd@foo.com",
//         address: "Internal address",
//       },
//       venue: "Palacio Blanco",
//       seat: "DIAMANTE-SECC-A3-ASTO-N15",
//       ticketId: 16412,
//     },
//     {
//       eventId: 15701,
//       img: 14999,
//       eventStart: 1722456000,
//       eventEnd: 1722469500,
//       eventName: "EVENTO PRUEBA DEL NUEVO NOMBRE",
//       qrCode: "1218567199ef49978da3abe8aa0b9383",
//       customer: {
//         name: "Internal",
//         phone: "1234",
//         email: "abcd@foo.com",
//         address: "Internal address",
//       },
//       venue: "Palacio Blanco",
//       seat: "PLATINUM-SECC-B3-ASTO-U13",
//       ticketId: 16413,
//     },
//   ];
  let tickets: Ticket[] = [];
  let email = '';
  let bookingId = 0;
  console.log(data);
  let busy = false;
  const createTickets = async () => {
    busy = true;
    try {
      
      const res = await fetch("/api/ticket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data, email }),
      });
      const resData = await res.json();
      if (!resData.bookingId) {
        alert("Error creando tickets");
        busy = false;
        return;
      }
      document.location.href = `/pages/booking/${resData.bookingId}/printableTickets`;
      // tickets = resData.tickets;
      // bookingId = resData.bookingId;
      // console.log(tickets);
    } catch (error) {
      console.log(error);
      busy = false;
    }
    
  };
</script>

<div class="forScreen">
  {#if busy}
    <h1>Creando tickets...</h1>
  {:else}
  {#if !data.seats || data.seats.length === 0}
    <h1>No hay asientos que comprar</h1>
  {:else}
    <h1>Asientos a comprar</h1>
    <ul>
      {#each data.seats as seat}
        <li>{seat?.seat}</li>
      {/each}
    </ul>
    Precio: {data.price?.totalBeforeTax || 0}, IVA {data.price?.tax || 0}. Total {data.price?.totalPrice || 0} MXN
    <div class="container m-20 flex flex-row m-3">
      <div class="p-3">Correo electrónico (opcional)</div> <input type="email" bind:value={email} placeholder="Correo electrónico" class="p-3 w-[200px]"/>
    </div>
    <div class="container m-20">
      <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        on:click={createTickets}>Crear tickets</button>
    </div>
    {/if}
  {/if}
</div>
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
      margin: 20px;
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
