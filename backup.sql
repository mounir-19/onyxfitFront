--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: cart_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cart_items (
    id integer NOT NULL,
    cart_id uuid NOT NULL,
    variant_id uuid NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    CONSTRAINT cart_items_quantity_check CHECK ((quantity > 0))
);


--
-- Name: cart_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.cart_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: cart_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.cart_items_id_seq OWNED BY public.cart_items.id;


--
-- Name: carts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.carts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    session_id character varying(255),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    parent_id integer,
    image_url text
);


--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: order_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.order_items (
    id integer NOT NULL,
    order_id uuid NOT NULL,
    variant_id uuid NOT NULL,
    product_name character varying(255) NOT NULL,
    variant_sku character varying(100) NOT NULL,
    flavor character varying(100),
    size_label character varying(50),
    quantity integer NOT NULL,
    unit_price numeric(10,2) NOT NULL
);


--
-- Name: order_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.order_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: order_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.order_items_id_seq OWNED BY public.order_items.id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.orders (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    status character varying(20) DEFAULT 'pending'::character varying NOT NULL,
    subtotal numeric(10,2) NOT NULL,
    shipping_cost numeric(10,2) DEFAULT 0,
    total numeric(10,2) NOT NULL,
    shipping_address text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    contact_name character varying(150),
    contact_phone character varying(20),
    contact_email character varying(255)
);


--
-- Name: payments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    order_id uuid NOT NULL,
    provider character varying(50) NOT NULL,
    provider_ref character varying(255),
    status character varying(20) DEFAULT 'pending'::character varying NOT NULL,
    amount numeric(10,2) NOT NULL,
    paid_at timestamp with time zone
);


--
-- Name: product_images; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_images (
    id integer NOT NULL,
    product_id uuid NOT NULL,
    image_url text NOT NULL,
    is_main boolean DEFAULT false
);


--
-- Name: product_images_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.product_images_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: product_images_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.product_images_id_seq OWNED BY public.product_images.id;


--
-- Name: product_variants; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_variants (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    product_id uuid NOT NULL,
    size_id integer,
    sku character varying(100) NOT NULL,
    flavor character varying(100),
    price numeric(10,2) NOT NULL,
    stock_qty integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true
);


--
-- Name: products; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.products (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    category_id integer,
    name character varying(255) NOT NULL,
    description text,
    brand character varying(100),
    image_url text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: reviews; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reviews (
    id integer NOT NULL,
    product_id uuid NOT NULL,
    user_id uuid NOT NULL,
    rating smallint NOT NULL,
    body text,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT reviews_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);


--
-- Name: reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.reviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: reviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.reviews_id_seq OWNED BY public.reviews.id;


--
-- Name: sizes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sizes (
    id integer NOT NULL,
    label character varying(50) NOT NULL,
    unit character varying(20),
    value numeric(8,2)
);


--
-- Name: sizes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sizes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sizes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sizes_id_seq OWNED BY public.sizes.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email character varying(255) NOT NULL,
    password_hash text NOT NULL,
    first_name character varying(100),
    last_name character varying(100),
    phone character varying(20),
    role character varying(20) DEFAULT 'customer'::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: cart_items id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_items ALTER COLUMN id SET DEFAULT nextval('public.cart_items_id_seq'::regclass);


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: order_items id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items ALTER COLUMN id SET DEFAULT nextval('public.order_items_id_seq'::regclass);


--
-- Name: product_images id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_images ALTER COLUMN id SET DEFAULT nextval('public.product_images_id_seq'::regclass);


--
-- Name: reviews id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews ALTER COLUMN id SET DEFAULT nextval('public.reviews_id_seq'::regclass);


--
-- Name: sizes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sizes ALTER COLUMN id SET DEFAULT nextval('public.sizes_id_seq'::regclass);


--
-- Data for Name: cart_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.cart_items (id, cart_id, variant_id, quantity) FROM stdin;
\.


--
-- Data for Name: carts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.carts (id, user_id, session_id, created_at, updated_at) FROM stdin;
3d1eed57-1597-4e76-a290-fef22d54b53c	39fad7df-faa1-4d8a-9437-8e37a4ebd2a3	\N	2026-03-07 13:14:59.110011+01	2026-03-07 13:14:59.110011+01
4bd48829-0482-4685-a73b-07fbbd165a34	52e9a53d-00a6-4693-9e0d-b15da980fea3	\N	2026-03-07 15:56:16.29701+01	2026-03-07 15:56:16.29701+01
385273e2-26e8-4ae4-9d5f-d7bc90c20204	ec69f988-9175-47c3-a979-1bc9ae1890b1	\N	2026-06-15 19:35:09.08943+02	2026-06-15 19:35:09.08943+02
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.categories (id, name, parent_id, image_url) FROM stdin;
17	Protein	\N	/uploads/products/protien-1781560256290-389245744.png
18	Creatine	\N	/uploads/products/creatine-1781560294979-798351583.png
19	Energy	\N	/uploads/products/energy-1781560313872-205495549.png
20	Multivitamin	\N	/uploads/products/multivitamin-1781560335628-129211646.png
21	plant	\N	/uploads/products/plant-1781560351344-648883069.png
22	Range	\N	/uploads/products/Range-1781560367351-638226168.png
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.order_items (id, order_id, variant_id, product_name, variant_sku, flavor, size_label, quantity, unit_price) FROM stdin;
1	420a54fa-bfb3-4726-aa50-57ed3895ec2d	a978fa23-f357-4fb5-940f-8ebc3714290b	uyfgug	fghjkhlkjhigygu	guyggy	22222kg	1	456.00
2	a048da35-2d33-46c6-b0ab-361f39dd5f88	a978fa23-f357-4fb5-940f-8ebc3714290b	uyfgug	fghjkhlkjhigygu	guyggy	22222kg	1	456.00
3	f0e8b300-0979-4489-92a9-6bf7e052ca4e	a978fa23-f357-4fb5-940f-8ebc3714290b	uyfgug	fghjkhlkjhigygu	guyggy	22222kg	1	456.00
4	820f8dfa-1dbb-45ee-a5af-65e23a8ac474	a978fa23-f357-4fb5-940f-8ebc3714290b	uyfgug	fghjkhlkjhigygu	guyggy	22222kg	1	456.00
5	990627b9-d288-4106-9894-397d30e24b10	a978fa23-f357-4fb5-940f-8ebc3714290b	uyfgug	fghjkhlkjhigygu	guyggy	22222kg	1	456.00
6	05d9ccf8-082b-43eb-b874-d67baf331d46	a978fa23-f357-4fb5-940f-8ebc3714290b	uyfgug	fghjkhlkjhigygu	guyggy	22222kg	10	456.00
7	1ed1e1d7-4dbd-4f26-b766-8e469baf0bfb	a978fa23-f357-4fb5-940f-8ebc3714290b	uyfgug	fghjkhlkjhigygu	guyggy	22222kg	10	456.00
8	6370fc66-bb23-4bc1-8613-5749bea270aa	a978fa23-f357-4fb5-940f-8ebc3714290b	uyfgug	fghjkhlkjhigygu	guyggy	22222kg	20	456.00
9	6370fc66-bb23-4bc1-8613-5749bea270aa	ad005f24-b72b-4ce6-b276-5539b0f88915	pro	pro	pro	1kg	19	23.00
10	5c528914-292f-45d1-8823-c2246c90de4f	1344ac36-b418-4f80-aa36-5f97249b5163	Hydro Whey	GSI-1KG-VAN	Rich Vanilla	1kg	30	54.99
11	cecbca4a-e6cf-4f46-8027-5a480823989a	e2f5dffc-af47-4a65-876c-2189eaf9aff1	Creatine Gummies	CRG-60SRV-BERRY	Mixed Berry	60servings	1	19.99
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.orders (id, user_id, status, subtotal, shipping_cost, total, shipping_address, created_at, contact_name, contact_phone, contact_email) FROM stdin;
57a48468-50a9-49af-8c0c-31fb3b68d59b	52e9a53d-00a6-4693-9e0d-b15da980fea3	pending	50.00	5.00	55.00	123 Main Street, Algiers	2026-03-07 16:35:26.722608+01	\N	\N	\N
420a54fa-bfb3-4726-aa50-57ed3895ec2d	ec69f988-9175-47c3-a979-1bc9ae1890b1	pending	456.00	0.00	456.00	test test\n0556448394\nlhouma	2026-06-15 21:05:15.503821+02	\N	\N	\N
a048da35-2d33-46c6-b0ab-361f39dd5f88	ec69f988-9175-47c3-a979-1bc9ae1890b1	pending	456.00	0.00	456.00	test test\n0556448394\nalger	2026-06-15 22:43:52.970352+02	\N	\N	\N
f0e8b300-0979-4489-92a9-6bf7e052ca4e	ec69f988-9175-47c3-a979-1bc9ae1890b1	pending	456.00	0.00	456.00	test test\n0556448394\nh	2026-06-15 22:47:35.48783+02	\N	\N	\N
820f8dfa-1dbb-45ee-a5af-65e23a8ac474	ec69f988-9175-47c3-a979-1bc9ae1890b1	confirmed	456.00	0.00	456.00	test test\n0556448394\nh	2026-06-15 22:48:52.778186+02	\N	\N	\N
990627b9-d288-4106-9894-397d30e24b10	ec69f988-9175-47c3-a979-1bc9ae1890b1	pending	456.00	0.00	456.00	test test\n0556448394\naa	2026-06-15 22:51:44.039182+02	\N	\N	\N
05d9ccf8-082b-43eb-b874-d67baf331d46	\N	pending	4560.00	0.00	4560.00	Mounir\n0777550608\nred.mounir.rabahi@gmail.com\nlhouma	2026-06-15 23:10:24.588263+02	\N	\N	\N
1ed1e1d7-4dbd-4f26-b766-8e469baf0bfb	\N	confirmed	4560.00	0.00	4560.00	aaa	2026-06-15 23:13:30.071552+02	Mounir	0777550608	red.mounir.rabahi@gmail.com
6370fc66-bb23-4bc1-8613-5749bea270aa	ec69f988-9175-47c3-a979-1bc9ae1890b1	confirmed	9557.00	0.00	9557.00	lhouma	2026-06-15 23:34:54.316242+02	test test	0556448394	test@gmail.com
5c528914-292f-45d1-8823-c2246c90de4f	52e9a53d-00a6-4693-9e0d-b15da980fea3	shipped	1649.70	0.00	1649.70	lhouma	2026-06-16 17:36:53.681299+02	Admin User	1234567890	admin@example.com
cecbca4a-e6cf-4f46-8027-5a480823989a	\N	confirmed	19.99	0.00	19.99	lhouma	2026-06-16 17:45:43.861359+02	Mounir	0777550608	red.mounir.rabahi@gmail.com
\.


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.payments (id, order_id, provider, provider_ref, status, amount, paid_at) FROM stdin;
37f95727-aad8-4835-afff-4e58d2e98430	820f8dfa-1dbb-45ee-a5af-65e23a8ac474	stripe	pi_3TihRfPPXPNzRjw90MbZ2F3M	paid	456.00	2026-06-15 22:49:21.444828+02
f7c614e8-200c-496b-825f-de7c48c647a4	05d9ccf8-082b-43eb-b874-d67baf331d46	stripe	pi_3TihmAPPXPNzRjw91yMPaPqY	pending	4560.00	\N
a5cb1653-6e71-4bf9-aff5-037105bbf879	1ed1e1d7-4dbd-4f26-b766-8e469baf0bfb	stripe	pi_3TihpKPPXPNzRjw91ckDiDnO	paid	4560.00	2026-06-15 23:13:47.779964+02
61f4cf8c-e06a-48ff-b946-7792ba681004	6370fc66-bb23-4bc1-8613-5749bea270aa	stripe	pi_3TiiA6PPXPNzRjw90Ef83zZb	paid	9557.00	2026-06-15 23:35:16.912044+02
9f4ce7d5-6a56-4397-8922-d3daa1caa0ba	5c528914-292f-45d1-8823-c2246c90de4f	stripe	pi_3Tiz3hPPXPNzRjw91G1lWyc1	paid	1649.70	2026-06-16 17:37:46.551827+02
5158b6e2-add2-4ede-b463-d6cd662af691	cecbca4a-e6cf-4f46-8027-5a480823989a	stripe	pi_3TizBlPPXPNzRjw90sws5qP3	paid	19.99	2026-06-16 17:46:06.126938+02
\.


--
-- Data for Name: product_images; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.product_images (id, product_id, image_url, is_main) FROM stdin;
\.


--
-- Data for Name: product_variants; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.product_variants (id, product_id, size_id, sku, flavor, price, stock_qty, is_active) FROM stdin;
a978fa23-f357-4fb5-940f-8ebc3714290b	1c771f9f-9624-4f6b-91f2-c2a36e4578ac	10	fghjkhlkjhigygu	guyggy	456.00	44	f
ad005f24-b72b-4ce6-b276-5539b0f88915	6d59d366-e1fe-4290-8e55-6dc72d003466	1	pro	pro	23.00	33	f
db761432-fe1e-42bc-b6cc-af80c81f15b4	97ca37d2-c773-42fe-ac4d-43e75d579779	1	GSW-1KG-CHOC	Double Rich Chocolate	49.99	100	t
47543ff3-d780-47da-8e14-dba74fd8fc92	97ca37d2-c773-42fe-ac4d-43e75d579779	1	GSW-1KG-VAN	Vanilla Ice Cream	49.99	100	t
1344ac36-b418-4f80-aa36-5f97249b5163	0c3c1801-91d8-4fb0-b37a-ca60fc371f5a	1	GSI-1KG-VAN	Rich Vanilla	54.99	100	t
af21af80-8a08-4e6d-870c-14a7de6e9b29	0c3c1801-91d8-4fb0-b37a-ca60fc371f5a	12	GSI-1KG-CHOC	Rich Vanilla	54.99	100	t
982dfe7b-b18c-4cc9-8b65-119af4a61a9a	6f151234-02ed-40c1-8b00-a8624db22c85	13	CRE-500G	\N	24.99	100	t
f0f7790c-6ab6-4660-974d-13322be22a15	6f151234-02ed-40c1-8b00-a8624db22c85	14	CRE-300G	\N	14.99	100	t
e2f5dffc-af47-4a65-876c-2189eaf9aff1	b0035b90-73bf-47c3-a60a-d87eb18f21a1	15	CRG-60SRV-BERRY	Mixed Berry	19.99	100	t
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.products (id, category_id, name, description, brand, image_url, is_active, created_at) FROM stdin;
1c771f9f-9624-4f6b-91f2-c2a36e4578ac	\N	uyfgug		ggg	/uploads/products/best2-1772979156777-318345479.png	f	2026-03-08 15:12:36.918389+01
6d59d366-e1fe-4290-8e55-6dc72d003466	\N	pro	pro	pro	/uploads/products/best1-1772883223513-460722409.png	f	2026-03-07 12:33:43.563279+01
97ca37d2-c773-42fe-ac4d-43e75d579779	17	Gold Standard 100% Whey	Industry-leading whey protein with 24g of protein and 5.5g of BCAAs per serving for muscle recovery and growth	Optimum Nutrition	/uploads/products/best1-1781623313511-674273613.png	t	2026-06-16 17:21:53.656216+02
0c3c1801-91d8-4fb0-b37a-ca60fc371f5a	17	Hydro Whey	Fast-digesting hydrolyzed whey protein isolate for rapid post-workout absorption	Optimum Nutrition	/uploads/products/best2-1781623449367-326662074.png	t	2026-06-16 17:24:09.514825+02
6f151234-02ed-40c1-8b00-a8624db22c85	18	Micronized Creatine Powder	Pure micronized creatine monohydrate to support strength, power, and muscle volume.	Optimum Nutrition	/uploads/products/best3-1781623777398-149646383.png	t	2026-06-16 17:29:37.488685+02
b0035b90-73bf-47c3-a60a-d87eb18f21a1	18	Creatine Gummies	Convenient chewable creatine gummies for daily strength support.	Optimum Nutrition	/uploads/products/creatine-1781623945418-501857872.png	t	2026-06-16 17:32:25.51432+02
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.reviews (id, product_id, user_id, rating, body, created_at) FROM stdin;
1	6d59d366-e1fe-4290-8e55-6dc72d003466	ec69f988-9175-47c3-a979-1bc9ae1890b1	3	\N	2026-06-15 20:44:57.332399+02
2	0c3c1801-91d8-4fb0-b37a-ca60fc371f5a	52e9a53d-00a6-4693-9e0d-b15da980fea3	4	\N	2026-06-16 17:36:08.235105+02
\.


--
-- Data for Name: sizes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sizes (id, label, unit, value) FROM stdin;
1	1kg	kg	1.00
2	2kg	kg	2.00
3	1g	g	1.00
4	22g	g	22.00
10	22222kg	kg	22222.00
11	4kg	kg	4.00
12	100kg	kg	100.00
13	500g	g	500.00
14	300g	g	300.00
15	60servings	servings	60.00
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, email, password_hash, first_name, last_name, phone, role, created_at) FROM stdin;
52e9a53d-00a6-4693-9e0d-b15da980fea3	admin@example.com	$2b$10$TyWo5lYC2f2gqqa9IRL8q.0CEYWbjsWbLYl.1fcx8l4nj.BisNI5W	Admin	User	1234567890	admin	2026-02-22 21:15:25.754226+01
39fad7df-faa1-4d8a-9437-8e37a4ebd2a3	red.mounir.rabahi@gmail.com	$2b$10$dcIy/lEpuNpMQUk/ptgpDeS//5jI3JlqoUGbIpRVx7XJZ1g7wqHVm	mounir	rabahi	0777550608	customer	2026-03-07 13:02:28.473891+01
dce85925-1d4a-4d60-b24f-d2d1ea1f747a	moumou@admin.com	$2b$10$g05a13OM3LsHUZaxZv9AJ.iTU7TMwgtwRZUcwKtRJTYFY0It4yCUu	moumou	admin	1234567890	admin	2026-03-07 15:10:06.553526+01
ec69f988-9175-47c3-a979-1bc9ae1890b1	test@gmail.com	$2b$10$eqSHSFT3sUCOhJ/6k8gyyOij5dskq/MRlKc/H2CkZ/nrAhvQOgo1S	test	test	0556448394	customer	2026-06-15 19:34:31.506551+02
\.


--
-- Name: cart_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.cart_items_id_seq', 28, true);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.categories_id_seq', 22, true);


--
-- Name: order_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.order_items_id_seq', 11, true);


--
-- Name: product_images_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.product_images_id_seq', 1, false);


--
-- Name: reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.reviews_id_seq', 2, true);


--
-- Name: sizes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.sizes_id_seq', 15, true);


--
-- Name: cart_items cart_items_cart_id_variant_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_cart_id_variant_id_key UNIQUE (cart_id, variant_id);


--
-- Name: cart_items cart_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_pkey PRIMARY KEY (id);


--
-- Name: carts carts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_pkey PRIMARY KEY (id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: payments payments_order_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_order_id_key UNIQUE (order_id);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- Name: product_images product_images_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT product_images_pkey PRIMARY KEY (id);


--
-- Name: product_variants product_variants_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_variants
    ADD CONSTRAINT product_variants_pkey PRIMARY KEY (id);


--
-- Name: product_variants product_variants_sku_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_variants
    ADD CONSTRAINT product_variants_sku_key UNIQUE (sku);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- Name: reviews reviews_product_id_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_product_id_user_id_key UNIQUE (product_id, user_id);


--
-- Name: sizes sizes_label_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sizes
    ADD CONSTRAINT sizes_label_key UNIQUE (label);


--
-- Name: sizes sizes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sizes
    ADD CONSTRAINT sizes_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_cart_items_cart; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_cart_items_cart ON public.cart_items USING btree (cart_id);


--
-- Name: idx_cart_session; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_cart_session ON public.carts USING btree (session_id);


--
-- Name: idx_cart_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_cart_user ON public.carts USING btree (user_id);


--
-- Name: idx_order_items_order; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_order_items_order ON public.order_items USING btree (order_id);


--
-- Name: idx_orders_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_orders_status ON public.orders USING btree (status);


--
-- Name: idx_orders_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_orders_user ON public.orders USING btree (user_id);


--
-- Name: idx_product_images_product_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_product_images_product_id ON public.product_images USING btree (product_id);


--
-- Name: idx_product_variants_product_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_product_variants_product_id ON public.product_variants USING btree (product_id);


--
-- Name: idx_products_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_products_active ON public.products USING btree (is_active);


--
-- Name: idx_products_category; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_products_category ON public.products USING btree (category_id);


--
-- Name: idx_reviews_product; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_reviews_product ON public.reviews USING btree (product_id);


--
-- Name: idx_variants_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_variants_active ON public.product_variants USING btree (is_active);


--
-- Name: idx_variants_product; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_variants_product ON public.product_variants USING btree (product_id);


--
-- Name: idx_variants_size; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_variants_size ON public.product_variants USING btree (size_id);


--
-- Name: cart_items cart_items_cart_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_cart_id_fkey FOREIGN KEY (cart_id) REFERENCES public.carts(id) ON DELETE CASCADE;


--
-- Name: cart_items cart_items_variant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_variant_id_fkey FOREIGN KEY (variant_id) REFERENCES public.product_variants(id) ON DELETE CASCADE;


--
-- Name: carts carts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: categories categories_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.categories(id) ON DELETE SET NULL;


--
-- Name: order_items order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: order_items order_items_variant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_variant_id_fkey FOREIGN KEY (variant_id) REFERENCES public.product_variants(id);


--
-- Name: orders orders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: payments payments_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- Name: product_images product_images_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT product_images_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: product_variants product_variants_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_variants
    ADD CONSTRAINT product_variants_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: product_variants product_variants_size_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_variants
    ADD CONSTRAINT product_variants_size_id_fkey FOREIGN KEY (size_id) REFERENCES public.sizes(id) ON DELETE SET NULL;


--
-- Name: products products_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE SET NULL;


--
-- Name: reviews reviews_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: reviews reviews_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

