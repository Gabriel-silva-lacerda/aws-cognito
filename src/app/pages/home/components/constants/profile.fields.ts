
export const PROFILE_FIELDS = () => {
  return {
    PROFILE: [
      {
        name: 'name',
        label: 'Nome:',
        type: 'text',
        padding: '10px',
      },
      {
        name: 'email',
        label: 'E-mail:',
        type: 'email',
        disabled: true,
        padding: '10px',
      },
    ],
  };
}
