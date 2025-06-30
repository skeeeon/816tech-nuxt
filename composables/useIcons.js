/**
 * Icon composable for consistent icon usage across the app
 * Provides commonly used Heroicons with consistent sizing
 */

// Outline icons (24px) - primary icon set
import {
  MagnifyingGlassIcon,
  PhoneIcon,
  EnvelopeIcon,
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
  Squares2X2Icon,
  ArrowRightIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  ServerIcon,
  DevicePhoneMobileIcon,
  WrenchScrewdriverIcon,
  CheckBadgeIcon,
  UsersIcon,
  StarIcon,
  EyeIcon,
  HeartIcon,
  ClockIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  PaintBrushIcon,
  ListBulletIcon,
  CheckIcon,
  CubeIcon,
  CalendarIcon,
  ChatBubbleLeftEllipsisIcon,
  BookOpenIcon,
  BuildingOfficeIcon,
  HomeIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
  Bars3Icon
} from '@heroicons/vue/24/outline'

// Solid icons (for filled states when needed)
import {
  CheckIcon as CheckIconSolid,
  StarIcon as StarIconSolid,
  HeartIcon as HeartIconSolid
} from '@heroicons/vue/24/solid'

export const useIcons = () => {
  // Map of semantic names to icon components
  const outlineIcons = {
    search: MagnifyingGlassIcon,
    phone: PhoneIcon,
    envelope: EnvelopeIcon,
    email: EnvelopeIcon, // Alias
    sun: SunIcon,
    moon: MoonIcon,
    desktop: ComputerDesktopIcon,
    grid: Squares2X2Icon,
    arrowRight: ArrowRightIcon,
    cog: Cog6ToothIcon,
    settings: Cog6ToothIcon, // Alias
    chart: ChartBarIcon,
    analytics: ChartBarIcon, // Alias
    shield: ShieldCheckIcon,
    security: ShieldCheckIcon, // Alias
    server: ServerIcon,
    mobile: DevicePhoneMobileIcon,
    wrench: WrenchScrewdriverIcon,
    tools: WrenchScrewdriverIcon, // Alias
    verified: CheckBadgeIcon,
    users: UsersIcon,
    star: StarIcon,
    eye: EyeIcon,
    heart: HeartIcon,
    clock: ClockIcon,
    time: ClockIcon, // Alias
    dollar: CurrencyDollarIcon,
    money: CurrencyDollarIcon, // Alias
    mapPin: MapPinIcon,
    location: MapPinIcon, // Alias
    palette: PaintBrushIcon,
    design: PaintBrushIcon, // Alias
    list: ListBulletIcon,
    check: CheckIcon,
    box: CubeIcon,
    package: CubeIcon, // Alias
    calendar: CalendarIcon,
    comments: ChatBubbleLeftEllipsisIcon,
    chat: ChatBubbleLeftEllipsisIcon, // Alias
    book: BookOpenIcon,
    documentation: BookOpenIcon, // Alias
    building: BuildingOfficeIcon,
    office: BuildingOfficeIcon, // Alias
    home: HomeIcon,
    refresh: ArrowPathIcon,
    reload: ArrowPathIcon, // Alias
    warning: ExclamationTriangleIcon,
    alert: ExclamationTriangleIcon, // Alias
    close: XMarkIcon,
    x: XMarkIcon, // Alias
    menu: Bars3Icon,
    hamburger: Bars3Icon // Alias
  }

  const solidIcons = {
    check: CheckIconSolid,
    star: StarIconSolid,
    heart: HeartIconSolid
  }

  /**
   * Get an outline icon by semantic name
   * @param {string} name - Semantic name of the icon
   * @returns {Component} Vue component for the icon
   */
  const getOutlineIcon = (name) => {
    return outlineIcons[name] || null
  }

  /**
   * Get a solid icon by semantic name
   * @param {string} name - Semantic name of the icon
   * @returns {Component} Vue component for the icon
   */
  const getSolidIcon = (name) => {
    return solidIcons[name] || null
  }

  /**
   * Common icon size classes for consistency
   */
  const iconSizes = {
    xs: 'w-3 h-3',      // 12px
    sm: 'w-4 h-4',      // 16px  
    base: 'w-5 h-5',    // 20px - default
    md: 'w-6 h-6',      // 24px
    lg: 'w-8 h-8',      // 32px
    xl: 'w-10 h-10',    // 40px
    '2xl': 'w-12 h-12', // 48px
    '3xl': 'w-16 h-16'  // 64px
  }

  return {
    outlineIcons,
    solidIcons,
    getOutlineIcon,
    getSolidIcon,
    iconSizes
  }
}
