create table public.brand_settings (
  id uuid primary key default gen_random_uuid(),
  primary_color text not null default '#EA580C',
  secondary_color text not null default '#FFEDD5',
  font_family text not null default 'Inter'
);

insert into public.brand_settings (id, primary_color, secondary_color, font_family)
values ('11111111-1111-1111-1111-111111111111', '#EA580C', '#FFEDD5', 'Inter');
