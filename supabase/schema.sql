-- Create members table
create table public.members (
  id uuid not null default gen_random_uuid (),
  full_name text not null,
  birth_date date null,
  cpf text not null,
  rg text null,
  address text null,
  phone text null,
  email text null,
  is_tither boolean null default false,
  tither_code text null,
  created_at timestamp with time zone not null default now(),
  constraint members_pkey primary key (id),
  constraint members_cpf_key unique (cpf)
);

-- Create transactions table
create table public.transactions (
  id uuid not null default gen_random_uuid (),
  type text not null, -- 'income' or 'expense'
  category text not null,
  amount numeric not null,
  description text null,
  date date not null default now(),
  member_id uuid null,
  created_at timestamp with time zone not null default now(),
  constraint transactions_pkey primary key (id),
  constraint transactions_member_id_fkey foreign key (member_id) references members (id)
);

-- Enable Row Level Security (RLS)
alter table public.members enable row level security;
alter table public.transactions enable row level security;

-- Create policies (Allow all for now since it's a simple app for one admin, 
-- but in production we should restrict this)
create policy "Enable read access for all users" on public.members
  for select using (true);

create policy "Enable insert access for all users" on public.members
  for insert with check (true);

create policy "Enable update access for all users" on public.members
  for update using (true);

create policy "Enable delete access for all users" on public.members
  for delete using (true);

create policy "Enable read access for all users" on public.transactions
  for select using (true);

create policy "Enable insert access for all users" on public.transactions
  for insert with check (true);

create policy "Enable update access for all users" on public.transactions
  for update using (true);

create policy "Enable delete access for all users" on public.transactions
  for delete using (true);
