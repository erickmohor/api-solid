import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import { CheckInUseCase } from './check-in'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'
import { MaxDistanceError } from './errors/max-distance-error'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Check-In Use Case', () => {
  beforeEach( async() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    await gymsRepository.create({
      id: 'gym-01',
      title: 'Gym 01',
      description: '',
      phone: '',
      latitude: -23.6270962,
      longitude: -46.563328,
    })

    vi.useFakeTimers()
  } )

  afterEach( () => {
    vi.useRealTimers()
  } )
  
  it('should be able to check in', async() => {   
    const { checkIn } = await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: -23.6270962,
      userLongitude: -46.563328,    
    })
    
    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async() => {
    vi.setSystemTime(new Date(2023, 4, 5, 8, 0, 0))

    await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: -23.6270962,
      userLongitude: -46.563328,    
    })
    
    await expect( () => 
      sut.execute({
        userId: 'user-01',
        gymId: 'gym-01',
        userLatitude: -23.6270962,
        userLongitude: -46.563328,    
      })
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should be able to check in twice but in different days', async() => {
    vi.setSystemTime(new Date(2023, 0, 5, 8, 0, 0))
    
    await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: -23.6270962,
      userLongitude: -46.563328,    
    })
    
    vi.setSystemTime(new Date(2023, 0, 6, 8, 0, 0))

    const { checkIn } = await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: -23.6270962,
      userLongitude: -46.563328,    
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on distant gym', async() => {   
    gymsRepository.items.push({
      id: 'gym-02',
      title: 'Gym 02',
      description: '',
      phone: '',
      latitude: new Decimal(-23.684036163396705),
      longitude: new Decimal(-46.564846867516316),
    })

    await expect( () => 
      sut.execute({
        userId: 'user-01',
        gymId: 'gym-02',
        userLatitude: -23.5887692,
        userLongitude: -46.6067256,  
      })).rejects.toBeInstanceOf(MaxDistanceError)
  })
  
})