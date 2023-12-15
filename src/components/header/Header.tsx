import logout from '../../api/logout'
import Button from '../button'
import { useMutation, useQuery } from '@tanstack/react-query'
import fetchUserData from '../../api/fetchUserData'
import { queryClient } from '../../main'
import ZupassLoginButton from '../zupassLoginButton'
import { HeaderContainer, NavButtons, SyledHeader } from './Header.styled'
import { useNavigate } from 'react-router-dom'

function Header() {
  const navigate = useNavigate() // Add this line to get the navigate function

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: fetchUserData,
    retry: false,
    staleTime: 10000,
  })

  const { mutate: mutateLogout } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] })
      navigate('/')
    },
  })

  return (
    <SyledHeader>
      <HeaderContainer>
        <div>Our logo</div>
        <nav>
          <NavButtons>
            {user ? (
              <li>
                <Button color="secondary" onClick={mutateLogout}>
                  Log out
                </Button>
              </li>
            ) : (
              <>
                <li>
                  <ZupassLoginButton color="secondary">
                    Login with Zupass
                  </ZupassLoginButton>
                </li>
              </>
            )}
          </NavButtons>
        </nav>
      </HeaderContainer>
    </SyledHeader>
  )
}

export default Header
