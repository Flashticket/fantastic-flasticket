<script lang="ts">
    import QrCode from '../components/QrCode.svelte';
    import moment from 'moment';
    export let data;
    let tickets = [
    {
        "eventId": 15701,
        "img": 14999,
        "eventStart": 1722456000,
        "eventEnd": 1722469500,
        "eventName": "EVENTO PRUEBA DEL NUEVO NOMBRE",
        "qrCode": "8c94da999fbd445baa215f8ea650c89f",
        "customer": {
            "name": "Internal",
            "phone": "1234",
            "email": "abcd@foo.com",
            "address": "Internal address"
        },
        "venue": "Palacio Blanco",
        "seat": "AZUL-VIP-SECC-C3-ASTO-JJ18",
        "ticketId": 16411
    },
    {
        "eventId": 15701,
        "img": 14999,
        "eventStart": 1722456000,
        "eventEnd": 1722469500,
        "eventName": "EVENTO PRUEBA DEL NUEVO NOMBRE",
        "qrCode": "5586a87843304ff890cfefb6c86c6609",
        "customer": {
            "name": "Internal",
            "phone": "1234",
            "email": "abcd@foo.com",
            "address": "Internal address"
        },
        "venue": "Palacio Blanco",
        "seat": "DIAMANTE-SECC-A3-ASTO-N15",
        "ticketId": 16412
    },
    {
        "eventId": 15701,
        "img": 14999,
        "eventStart": 1722456000,
        "eventEnd": 1722469500,
        "eventName": "EVENTO PRUEBA DEL NUEVO NOMBRE",
        "qrCode": "1218567199ef49978da3abe8aa0b9383",
        "customer": {
            "name": "Internal",
            "phone": "1234",
            "email": "abcd@foo.com",
            "address": "Internal address"
        },
        "venue": "Palacio Blanco",
        "seat": "PLATINUM-SECC-B3-ASTO-U13",
        "ticketId": 16413
    }
];
    // let tickets = [];
    console.log(data);
    let busy = false;
  const createTickets = async () => {
    busy = true;
    try {
        const seats  = data.seats as string[];
        const res = await fetch('/api/ticket', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ seats })
        });
        tickets = await res.json();
        console.log(tickets);
    } catch (error) {
        console.log(error);
    }
    busy = false;
  }
</script>
<div class="forScreen">
    {#if busy}
        <p>Creating tickets...</p>
    {:else}
        <button on:click={createTickets} >Crear tickets</button>
    {/if}
    
</div>
{#each tickets as ticket, i}
    <div class={i < tickets.length - 1 ? "break" : ""}>
        <h3>{ticket.eventName}</h3>
        <p>Lugar: {ticket.venue}</p>
        <p>Asiento: {ticket.seat}</p>
        <p>Fecha: {moment(new Date(ticket.eventStart * 1000)).format('DD/MM/yyyy')}</p>
        <QrCode text={ticket.qrCode} />
    </div>
{/each}
<style>
    @media screen {
        .forPrint {
            display: none;
        }
        .forScreen {
            display: block;
        }
    }
    @media print {
        .forPrint {
            display: block;
        }
        .forScreen {
            display: none;
        }
        .break {page-break-after: always;}
        @page { margin: 0; }
    }
</style>