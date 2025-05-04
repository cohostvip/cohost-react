import * as React from 'react';
import { createContext, useContext } from 'react';
import {
    EventProfile,
    Ticket,
} from '@cohostvip/cohost-node/types/index';
import { useCohostClient } from './CohostContext';

export type CohostEventProviderProps = {
    loadTickets?: boolean;
    children: React.ReactNode;
} & (
        | {
            /** If event is provided, skip fetching. Optionally provide eventId for ticket loading. */
            event: EventProfile;
            eventId?: string;
        }
        | {
            /** If event not provided, must provide eventId for fetching. */
            event?: EventProfile;
            eventId: string;
        }
    );

export type CohostEventContextType = {
    state: 'initial' | 'loading' | 'loading-tickets' | 'ready';

    /**
     * The event instance, will be undefined while loading
     */
    event?: EventProfile;

    /**
     * If `loadTickets` is true, this will be populated with the tickets for the event
     * If `loadTickets` is false, this will be null
     * @default false
     */
    tickets?: Ticket[] | null;
}

const CohostEventContext = createContext<CohostEventContextType | null>(null);

export const CohostEventProvider: React.FC<CohostEventProviderProps> = ({
    event: providedEvent,
    eventId,
    loadTickets = false,
    children,
}) => {
    const { client } = useCohostClient();

    const [state, setState] = React.useState<CohostEventContextType['state']>('initial');
    const [event, setEvent] = React.useState<EventProfile | undefined>(providedEvent);
    const [tickets, setTickets] = React.useState<Ticket[] | null | undefined>(undefined);

    // Use provided event's ID or fallback to eventId prop
    const resolvedEventId = providedEvent?.id || eventId;

    /**
     * Load event from API if not provided.
     * Skip loading if event was passed via props.
     */
    React.useEffect(() => {
        if (providedEvent) {
            // Use the provided event and skip fetching
            setEvent(providedEvent);
            setState('ready');
            return;
        }

        if (!eventId) return; // Safety guard if eventId is undefined

        setState('loading');
        client.events.fetch(eventId)
            .then((fetchedEvent: EventProfile) => {
                setEvent(fetchedEvent);
                setState('ready');
            })
            .catch(() => {
                // On error, reset to initial state
                setState('initial');
            });
    }, [client, eventId, providedEvent]);

    /**
     * Optionally load tickets once event is available and loadTickets is true.
     * If event is not loaded yet, this waits until it becomes available.
     */
    React.useEffect(() => {
        if (!loadTickets || !event?.id) {
            setTickets(null);
            return;
        }

        setState('loading-tickets');
        client.events.tickets(event.id)
            .then((tickets: Ticket[]) => {
                setTickets(tickets);
                setState('ready');
            })
            .catch(() => {
                // Fail silently and continue with ready state
                setState('ready');
            });
    }, [client, event?.id, loadTickets]);

    return (
        <CohostEventContext.Provider value={{
            state,
            event,
            tickets,
        }}>
            {children}
        </CohostEventContext.Provider>
    );
};

/**
 * Hook to access the current CohostEventContext
 * Must be used inside a <CohostEventProvider>
 */
export const useCohostEvent = (): CohostEventContextType => {
    const ctx = useContext(CohostEventContext);
    if (!ctx) throw new Error("useCohostEvent must be used within a CohostEventProvider");
    return ctx;
};
