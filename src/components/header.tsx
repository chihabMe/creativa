import HeaderContent from './header/header-content'
import { getCategoriesByGroupFromDB, getFeaturedCategoriesFromDB } from '@/lib/data'

const Header = async () => {
   const featuredCategories = await getFeaturedCategoriesFromDB()
  const groupedCategories = await getCategoriesByGroupFromDB()

  return (
    <HeaderContent 
    featuredCategories={featuredCategories}
    groupedCategories={groupedCategories}
    />
  )
}

export default Header