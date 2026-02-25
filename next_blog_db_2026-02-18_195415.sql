--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3
-- Dumped by pg_dump version 16.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: Role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Role" AS ENUM (
    'SUPER_ADMIN',
    'ADMIN',
    'USER'
);


ALTER TYPE public."Role" OWNER TO postgres;

--
-- Name: UserStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."UserStatus" AS ENUM (
    'ACTIVE',
    'INACTIVE',
    'BLOCK'
);


ALTER TYPE public."UserStatus" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Post; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Post" (
    id integer NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    thumbnail text,
    "isFeatured" boolean DEFAULT false NOT NULL,
    tags text[],
    views integer DEFAULT 0 NOT NULL,
    "authorId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Post" OWNER TO postgres;

--
-- Name: Post_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Post_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Post_id_seq" OWNER TO postgres;

--
-- Name: Post_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Post_id_seq" OWNED BY public."Post".id;


--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    email text NOT NULL,
    "isVerified" boolean DEFAULT false NOT NULL,
    name text NOT NULL,
    password text,
    phone text NOT NULL,
    picture text,
    role public."Role" DEFAULT 'USER'::public."Role" NOT NULL,
    status public."UserStatus" DEFAULT 'ACTIVE'::public."UserStatus" NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: User_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."User_id_seq" OWNER TO postgres;

--
-- Name: User_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".id;


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: Post id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Post" ALTER COLUMN id SET DEFAULT nextval('public."Post_id_seq"'::regclass);


--
-- Name: User id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);


--
-- Data for Name: Post; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Post" (id, title, content, thumbnail, "isFeatured", tags, views, "authorId", "createdAt", "updatedAt") FROM stdin;
1	MSI G255F 25 180Hz 1ms IPS FHD Gaming Monitor	The MSI G255F is a 25-inch gaming monitor featuring a rapid IPS screen with a response time of 1ms (GtG), 1920x1080 resolution, and an 180Hz refresh rate. Its quick IPS panel technology guarantees clear, colorful images on a 1920 x 1080 Full HD quality	https://www.pchouse.com.bd/image/cache/catalog/MSI/g255f-01-500x500-500x500.png	t	{devices,monitor}	0	1	2026-02-10 10:30:23.515	2026-02-10 10:30:23.515
2	MSI MAG 273QP QD OLED Gaming Monitor	The MSI MAG 273QP QD OLED features a 27-inch OLED panel with quantum dot enhancement, delivering superb contrast, deep blacks, and vibrant colors ideal for both gaming and creative work.	https://www.pchouse.com.bd/image/cache/catalog/MSI/MSI-MAG-273QP-QD-OLED-X24-1-500x500.jpg	t	{devices,monitor}	0	1	2026-02-10 10:37:18.057	2026-02-10 10:37:18.057
3	Xiaomi Redmi A27Q — Stylish QHD Monitor	The Xiaomi Redmi A27Q brings a stylish design to your desk along with QHD resolution and smooth performance for daily use and content consumption.	https://www.pchouse.com.bd/image/cache/catalog/Xiaomi%20Redmi%20A27Q/Xiaomi%20Redmi%20A27Q%20(2)-500x500.png	t	{devices,monitor,design}	0	1	2026-02-10 10:39:18.199	2026-02-10 10:39:18.199
4	Xiaomi Redmi A27Q — Stylish QHD Monitor	The Xiaomi Redmi A27Q brings a stylish design to your desk along with QHD resolution and smooth performance for daily use and content consumption.	https://www.pchouse.com.bd/image/cache/catalog/Xiaomi%20Redmi%20A27Q/Xiaomi%20Redmi%20A27Q%20(2)-500x500.png	t	{devices,monitor,design}	0	1	2026-02-10 10:40:36.102	2026-02-10 10:40:36.102
5	MSI MAG 273QP QD OLED — Premium Gaming Experience	Elevate your gaming sessions with OLED contrast and quantum dot vibrance, delivering immersive gameplay and crisp visuals on every frame.	https://www.pchouse.com.bd/image/cache/catalog/MSI/MSI-MAG-273QP-QD-OLED-X24-4-500x500.jpg	t	{devices,monitor,gaming}	0	1	2026-02-10 10:41:30.805	2026-02-10 10:41:30.805
6	LG UltraFine 32UN650K-W 32 4K Monitor for Professionals	Perfect for professional workflows, the LG UltraFine 32UN650K-W delivers stunning 4K clarity and color reproduction for design, editing, and multitasking.	https://www.pchouse.com.bd/image/cache/catalog/LG%20UltraFine%2032UN650K-W/LG%20UltraFine%2032UN650K-W%202-500x500.png	f	{devices,monitor,professional}	0	1	2026-02-10 10:42:08.698	2026-02-10 10:42:08.698
7	Xiaomi Redmi A27Q QHD Monitor — Affordable Large Screen	This Xiaomi Redmi A27Q monitor combines a large 27-inch QHD display with a competitive price, suitable for home offices and entertainment.	https://www.pchouse.com.bd/image/cache/catalog/Xiaomi%20Redmi%20A27Q/Xiaomi%20Redmi%20A27Q%202026-500x500.png	f	{devices,monitor,value}	0	1	2026-02-10 10:42:20.145	2026-02-10 10:42:20.145
8	MSI MAG 273QP QD OLED Gaming Monitor — Best for Creatives	With OLED technology and quantum dot color, this MSI monitor is excellent for creators who need deep blacks and accurate colors for design and content work.	https://www.pchouse.com.bd/image/cache/catalog/MSI/MSI-MAG-273QP-QD-OLED-X24-1-500x500.jpg	f	{devices,monitor,creative}	0	1	2026-02-10 10:42:31.927	2026-02-10 10:42:31.927
9	Philips 22E1N1200AW 21.5 Inch 100Hz FHD IPS LED Monitor	esolution: FHD (1920 x 1080) Display: IPS, 100Hz, 1ms (GtG) Ports: 1x HDMI 1.4 , 1x VGA, 1x DisplayPort, 1x Audio Features: Adaptive sync, FreeSync, Low Blue Light, sRGB	https://www.pchouse.com.bd/image/cache/catalog/PHILIPS/Philips-22E1N1200AW-21.5-Inch-100Hz-FHD-IPS-LED-Monitor-1-500x500.jpg	t	{monitor,gadget}	0	1	2026-02-18 11:19:32.421	2026-02-18 11:19:32.421
10	Philips Evnia 27M2N8500 27 Inch 360Hz QD OLED Gaming Monitor	Model: 27M2N8500 Resolution: 2K QHD (2560 x 1440) Display: QD OLED, 360 Hz, 0.03 ms (GTG) Ports: 2x HDMI 2.1, 1x DP 1.4, 3x Thunderbolt 4 USB Features: DisplayHDR TrueBlack 400, Built-in Speakers, AMD FreeSync Premium Pro	https://www.pchouse.com.bd/image/cache/catalog/PHILIPS/Philips-Evnia-27M2N8500-27-Inch-360Hz-QD-OLED-Gaming-Monitor-500x500.jpg	t	{monitor,gadget}	0	1	2026-02-18 11:23:28.276	2026-02-18 11:23:28.276
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, "createdAt", email, "isVerified", name, password, phone, picture, role, status, "updatedAt") FROM stdin;
1	2026-02-09 13:13:56.759	3@demo.com	f	Habiba	nextblog12	123456789	\N	USER	ACTIVE	2026-02-09 13:13:56.759
2	2026-02-09 13:14:53.644	ayesha@demo.com	f	Ayesha	securePass1	987654321	\N	USER	ACTIVE	2026-02-09 13:14:53.644
3	2026-02-09 13:15:07.42	rahim@demo.com	f	Rahim	rahim123	01712345678	\N	USER	ACTIVE	2026-02-09 13:15:07.42
4	2026-02-09 13:15:19.475	karim@demo.com	f	Karim	karim@456	01898765432	\N	USER	ACTIVE	2026-02-09 13:15:19.475
5	2026-02-09 13:15:28.602	nusrat@demo.com	f	Nusrat	nusratPass	01922334455	\N	USER	ACTIVE	2026-02-09 13:15:28.602
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
ee030ecf-33a2-4dd0-8c34-cae7aa4bf318	6cb3c93dba5ddb185c3041c703cc82fe21b789b100db1277f0b0a9f9fdca1bef	2026-02-09 18:16:39.087307+06	20250905120047_user_id	\N	\N	2026-02-09 18:16:39.045712+06	1
e9b4dcbe-8b40-46a5-b807-1d707c730118	d3274fb97e1a183fbe08acea62ba4320791a0242987c5c1ac1b7eb8b7c0d0411	2026-02-09 18:16:39.134901+06	20250905121622_user_table	\N	\N	2026-02-09 18:16:39.088641+06	1
f73c520c-2a25-4caa-a16f-843d5fd4541d	ca34809f24a5b4b0ea9f4bc34bc41bd64b89d23e47b1b10a70b445d2fc1d04e8	2026-02-09 18:16:39.201801+06	20250905122006_post_table	\N	\N	2026-02-09 18:16:39.13591+06	1
a9a2725c-8dae-40a2-bf5a-45af1cc8baee	da81a4cc43a060054b33d270ea77467f4709284d9d53dc39cd3e0190214b6dd3	2026-02-09 18:16:39.212155+06	20250905134622_one_to_many_relation	\N	\N	2026-02-09 18:16:39.202794+06	1
505f0591-84ec-412c-9721-9525efc0c041	98f8aa086c24f93c1138392f313cc546cbb68c7a973707cee3a47ddfe8ca76dc	2026-02-09 18:16:39.250402+06	20250912123831_email_unique	\N	\N	2026-02-09 18:16:39.213226+06	1
\.


--
-- Name: Post_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Post_id_seq"', 10, true);


--
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."User_id_seq"', 5, true);


--
-- Name: Post Post_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Post"
    ADD CONSTRAINT "Post_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: Post Post_authorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Post"
    ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

