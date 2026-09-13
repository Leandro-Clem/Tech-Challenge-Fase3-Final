/**
 * Ícones desenhados como traço contínuo, com a mesma espessura da
 * régua da interface. Usam `currentColor`, então acompanham
 * automaticamente o modo claro ou escuro e a cor do botão.
 */
function Icon({ size = 18, children, ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      style={{ flexShrink: 0 }}
      {...rest}
    >
      {children}
    </svg>
  );
}

export const SearchIcon = (props) => (
  <Icon {...props}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="M16 16l4.5 4.5" />
  </Icon>
);

export const PencilIcon = (props) => (
  <Icon {...props}>
    <path d="M4 20l4.5-1 9-9a2.1 2.1 0 0 0-3-3l-9 9L4 20z" />
    <path d="M14.5 5.5l3 3" />
  </Icon>
);

export const TrashIcon = (props) => (
  <Icon {...props}>
    <path d="M4 7h16" />
    <path d="M9.5 7V5h5v2" />
    <path d="M6.5 7l1 12.5h9L17.5 7" />
    <path d="M10.5 11v5M13.5 11v5" />
  </Icon>
);

export const PlusIcon = (props) => (
  <Icon {...props}>
    <path d="M12 5v14M5 12h14" />
  </Icon>
);

export const ArrowLeftIcon = (props) => (
  <Icon {...props}>
    <path d="M19 12H5" />
    <path d="M11 6l-6 6 6 6" />
  </Icon>
);

export const CommentIcon = (props) => (
  <Icon {...props}>
    <path d="M20 14.5a2.5 2.5 0 0 1-2.5 2.5H9l-4 3.5V6.5A2.5 2.5 0 0 1 7.5 4h10A2.5 2.5 0 0 1 20 6.5z" />
    <path d="M8.5 9h7M8.5 12.5h4.5" />
  </Icon>
);

export const SendIcon = (props) => (
  <Icon {...props}>
    <path d="M20 4L3.5 10.5l6.5 2.5 2.5 6.5z" />
    <path d="M10 13l4.5-4.5" />
  </Icon>
);

export const CheckIcon = (props) => (
  <Icon {...props}>
    <path d="M4.5 12.5l5 5 10-11" />
  </Icon>
);

export const CloseIcon = (props) => (
  <Icon {...props}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Icon>
);

export const SunIcon = (props) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2.5v2.5M12 19v2.5M21.5 12H19M5 12H2.5M18.7 5.3l-1.8 1.8M7.1 16.9l-1.8 1.8M18.7 18.7l-1.8-1.8M7.1 7.1L5.3 5.3" />
  </Icon>
);

export const MoonIcon = (props) => (
  <Icon {...props}>
    <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z" />
  </Icon>
);

export const LogInIcon = (props) => (
  <Icon {...props}>
    <path d="M14 4h4.5A1.5 1.5 0 0 1 20 5.5v13a1.5 1.5 0 0 1-1.5 1.5H14" />
    <path d="M10 8l4 4-4 4" />
    <path d="M14 12H4" />
  </Icon>
);

export const LogOutIcon = (props) => (
  <Icon {...props}>
    <path d="M10 4H5.5A1.5 1.5 0 0 0 4 5.5v13A1.5 1.5 0 0 0 5.5 20H10" />
    <path d="M16 8l4 4-4 4" />
    <path d="M20 12H10" />
  </Icon>
);

export const PostsIcon = (props) => (
  <Icon {...props}>
    <path d="M4 5.5h16M4 12h16M4 18.5h10" />
  </Icon>
);

export const WriteIcon = (props) => (
  <Icon {...props}>
    <path d="M5 19.5h14" />
    <path d="M6 15.5l1-3.5 7.5-7.5a1.8 1.8 0 0 1 2.5 2.5L9.5 14.5z" />
  </Icon>
);

export const ShelfIcon = (props) => (
  <Icon {...props}>
    <path d="M4 5.5h5.5v14H4zM11.5 5.5H17v14h-5.5z" />
    <path d="M4 10h5.5M11.5 10H17" />
  </Icon>
);

export const AlertIcon = (props) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5v5M12 16h.01" />
  </Icon>
);

export default Icon;
