import { bindCombo, expectToTrigger, resetAllCombos } from './utils/bindCombo'

jest.setTimeout(300000)

describe('Simonsson.bind', () => {
	beforeAll(async () => {
		await page.goto('http://localhost:9000/index.html')
		await page.waitForTimeout(300)
	})

	beforeEach(async () => {
		await resetAllCombos()
	})

	describe('keydown', () => {
		describe('basics', () => {
			beforeAll(async () => {
				await bindCombo('KeyA')
				await bindCombo('KeyB')
			})

			it('KeyA fires when pressing KeyA', async () => {
				await expectToTrigger('KeyA', false)
				await page.keyboard.press('KeyA')
				await expectToTrigger('KeyA', true)
			})

			it('KeyA fires on keydown', async () => {
				await expectToTrigger('KeyA', false)
				await page.keyboard.down('KeyA')
				await expectToTrigger('KeyA', true)
				await page.keyboard.up('KeyA')
			})

			it("KeyA doesn't fire on KeyB", async () => {
				await expectToTrigger('KeyA', false)
				await page.keyboard.down('KeyB')
				await expectToTrigger('KeyA', false)
				await page.keyboard.up('KeyB')
			})

			it("KeyA doesn't fire when holding Shift", async () => {
				await expectToTrigger('KeyA', false)
				await page.keyboard.down('ShiftLeft')
				await page.keyboard.down('KeyA')
				await expectToTrigger('KeyA', false)
				await page.keyboard.up('ShiftLeft')
				await page.keyboard.up('KeyA')
			})

			describe('global', () => {
				beforeAll(async () => {
					await bindCombo('KeyY')
					await bindCombo('KeyZ', {
						global: true,
					})
				})
				it("KeyY doesn't fire when inside an input element", async () => {
					await page.focus('input')
					await expectToTrigger('KeyY', false)
					await page.keyboard.down('KeyY')
					await expectToTrigger('KeyY', false)
					await page.keyboard.up('KeyY')
				})

				it('KeyZ fires when inside a textarea element', async () => {
					await page.focus('textarea')
					await expectToTrigger('KeyZ', false)
					await page.keyboard.down('KeyZ')
					await expectToTrigger('KeyZ', true)
					await page.keyboard.up('KeyZ')
				})

				afterAll(async () => {
					await page.focus('button')
				})
			})
		})

		describe('combinations', () => {
			describe('regular keys', () => {
				describe('unordered', () => {
					beforeAll(async () => {
						await bindCombo('KeyC+KeyD')
					})

					it('KeyC+KeyD fires when pressing KeyC, KeyD', async () => {
						await expectToTrigger('KeyC+KeyD', false)
						await page.keyboard.down('KeyC')
						await page.keyboard.down('KeyD')
						await expectToTrigger('KeyC+KeyD', true)
						await page.keyboard.up('KeyC')
						await page.keyboard.up('KeyD')
					})

					it('KeyC+KeyD fires when pressing KeyD, KeyC', async () => {
						await expectToTrigger('KeyC+KeyD', false)
						await page.keyboard.down('KeyD')
						await page.keyboard.down('KeyC')
						await expectToTrigger('KeyC+KeyD', true)
						await page.keyboard.up('KeyD')
						await page.keyboard.up('KeyC')
					})
				})
				describe('ordered', () => {
					beforeAll(async () => {
						await bindCombo('KeyD+KeyE', {
							ordered: true,
						})
					})

					it('KeyD+KeyE fires when pressing KeyD, KeyE', async () => {
						await expectToTrigger('KeyD+KeyE', false)
						await page.keyboard.down('KeyD')
						await page.keyboard.down('KeyE')
						await expectToTrigger('KeyD+KeyE', true)
						await page.keyboard.up('KeyE')
						await page.keyboard.up('KeyD')
					})

					it("KeyD+KeyE doesn't fire when pressing KeyE, KeyD", async () => {
						await expectToTrigger('KeyD+KeyE', false)
						await page.keyboard.down('KeyE')
						await page.keyboard.down('KeyD')
						await expectToTrigger('KeyD+KeyE', false)
						await page.keyboard.up('KeyE')
						await page.keyboard.up('KeyD')
					})
				})
			})

			describe('modifier and key', () => {
				describe('unordered', () => {
					beforeAll(async () => {
						await bindCombo('Shift+KeyE')
					})

					it('Shift+KeyE fires when pressing ShiftLeft+KeyE', async () => {
						await expectToTrigger('Shift+KeyE', false)
						await page.keyboard.down('ShiftLeft')
						await page.keyboard.down('KeyE')
						await expectToTrigger('Shift+KeyE', true)
						await page.keyboard.up('KeyE')
						await page.keyboard.up('ShiftLeft')
					})

					it('Shift+KeyE fires when pressing ShiftRight+KeyE', async () => {
						await expectToTrigger('Shift+KeyE', false)
						await page.keyboard.down('ShiftRight')
						await page.keyboard.down('KeyE')
						await expectToTrigger('Shift+KeyE', true)
						await page.keyboard.up('KeyE')
						await page.keyboard.up('ShiftRight')
					})

					it('Shift+KeyE fires when pressing KeyE+ShiftRight', async () => {
						await expectToTrigger('Shift+KeyE', false)
						await page.keyboard.down('KeyE')
						await page.keyboard.down('ShiftRight')
						await expectToTrigger('Shift+KeyE', true)
						await page.keyboard.up('KeyE')
						await page.keyboard.up('ShiftRight')
					})

					it("Shift+KeyE doesn't fire when pressing ShiftRight+KeyC", async () => {
						await expectToTrigger('Shift+KeyE', false)
						await page.keyboard.down('ShiftRight')
						await page.keyboard.down('KeyC')
						await expectToTrigger('Shift+KeyE', false)
						await page.keyboard.up('KeyC')
						await page.keyboard.up('ShiftRight')
					})

					it("Shift+KeyE doesn't fire when pressing KeyE", async () => {
						await expectToTrigger('Shift+KeyE', false)
						await page.keyboard.down('KeyE')
						await page.keyboard.up('KeyE')
						await expectToTrigger('Shift+KeyE', false)
					})

					it("Shift+KeyE doesn't fire when pressing Shift+Alt+KeyE", async () => {
						await expectToTrigger('Shift+KeyE', false)
						await page.keyboard.down('ShiftRight')
						await page.keyboard.down('AltRight')
						await page.keyboard.down('KeyE')
						await expectToTrigger('Shift+KeyE', false)
						await page.keyboard.up('KeyE')
						await page.keyboard.up('AltRight')
						await page.keyboard.up('ShiftRight')
					})
				})

				describe('ordered', () => {
					beforeAll(async () => {
						await bindCombo('Shift+KeyA', {
							ordered: true,
						})
					})

					it('Shift+KeyA fires when pressing ShiftLeft+KeyA', async () => {
						await expectToTrigger('Shift+KeyA', false)
						await page.keyboard.down('ShiftLeft')
						await page.keyboard.down('KeyA')
						await expectToTrigger('Shift+KeyA', true)
						await page.keyboard.up('KeyA')
						await page.keyboard.up('ShiftLeft')
					})

					it("Shift+KeyA doesn't fire when pressing KeyA+ShiftLeft", async () => {
						await expectToTrigger('Shift+KeyA', false)
						await page.keyboard.down('KeyA')
						await page.keyboard.down('ShiftLeft')
						await expectToTrigger('Shift+KeyA', false)
						await page.keyboard.up('KeyA')
						await page.keyboard.up('ShiftLeft')
					})
				})

				describe('modifiersFirst', () => {
					beforeAll(async () => {
						await bindCombo('Ctrl+Shift+KeyB', {
							ordered: 'modifiersFirst',
						})
					})

					it('Ctrl+Shift+KeyB fires when pressing ShiftLeft+ControlLeft+KeyB', async () => {
						await expectToTrigger('Ctrl+Shift+KeyB', false)
						await page.keyboard.down('ShiftLeft')
						await page.keyboard.down('ControlLeft')
						await page.keyboard.down('KeyB')
						await expectToTrigger('Ctrl+Shift+KeyB', true)
						await page.keyboard.up('KeyB')
						await page.keyboard.up('ShiftLeft')
						await page.keyboard.up('ControlLeft')
					})

					it('Ctrl+Shift+KeyB fires when pressing ControlLeft+ShiftLeft+KeyB', async () => {
						await expectToTrigger('Ctrl+Shift+KeyB', false)
						await page.keyboard.down('ControlLeft')
						await page.keyboard.down('ShiftLeft')
						await page.keyboard.down('KeyB')
						await expectToTrigger('Ctrl+Shift+KeyB', true)
						await page.keyboard.up('KeyB')
						await page.keyboard.up('ShiftLeft')
						await page.keyboard.up('ControlLeft')
					})

					it("Ctrl+Shift+KeyB doesn't fire when pressing KeyB+ControlLeft+ShiftLeft", async () => {
						await expectToTrigger('Ctrl+Shift+KeyB', false)
						await page.keyboard.down('KeyB')
						await page.keyboard.down('ControlLeft')
						await page.keyboard.down('ShiftLeft')
						await expectToTrigger('Ctrl+Shift+KeyB', false)
						await page.keyboard.up('KeyB')
						await page.keyboard.up('ShiftLeft')
						await page.keyboard.up('ControlLeft')
					})

					it("Ctrl+Shift+KeyB doesn't fire when pressing ControlLeft+KeyB+ShiftLeft", async () => {
						await expectToTrigger('Ctrl+Shift+KeyB', false)
						await page.keyboard.down('ControlLeft')
						await page.keyboard.down('KeyB')
						await page.keyboard.down('ShiftLeft')
						await expectToTrigger('Ctrl+Shift+KeyB', false)
						await page.keyboard.up('KeyB')
						await page.keyboard.up('ShiftLeft')
						await page.keyboard.up('ControlLeft')
					})
				})

				describe('exclusive: false', () => {
					beforeAll(async () => {
						await bindCombo('Ctrl+Shift+KeyA', {
							ordered: 'modifiersFirst',
							exclusive: false,
						})
					})

					it('Ctrl+Shift+KeyA fires when pressing ControlLeft+ShiftLeft+KeyL+KeyA', async () => {
						await expectToTrigger('Ctrl+Shift+KeyA', false)
						await page.keyboard.down('ControlLeft')
						await page.keyboard.down('ShiftLeft')
						await page.keyboard.down('KeyL')
						await page.keyboard.down('KeyA')
						await expectToTrigger('Ctrl+Shift+KeyA', true)
						await page.keyboard.up('KeyL')
						await page.keyboard.up('ControlLeft')
						await page.keyboard.up('KeyA')
						await page.keyboard.up('ShiftLeft')
					})

					it('Ctrl+Shift+KeyA fires when pressing KeyA+ControlLeft+ShiftLeft+KeyL', async () => {
						await expectToTrigger('Ctrl+Shift+KeyA', false)
						await page.keyboard.down('KeyL')
						await page.keyboard.down('ControlLeft')
						await page.keyboard.down('ShiftLeft')
						await page.keyboard.down('KeyA')
						await expectToTrigger('Ctrl+Shift+KeyA', true)
						await page.keyboard.up('ControlLeft')
						await page.keyboard.up('KeyA')
						await page.keyboard.up('ShiftLeft')
						await page.keyboard.up('KeyL')
					})
				})
			})
		})

		describe('chords', () => {
			describe('unordered', () => {
				beforeAll(async () => {
					await bindCombo('KeyA+KeyC KeyB+KeyD')
				})

				it('KeyA+KeyC KeyB+KeyD fires when pressing KeyA+KeyC followed by KeyB+KeyD', async () => {
					await expectToTrigger('KeyA+KeyC KeyB+KeyD', false)
					await page.keyboard.down('KeyA')
					await page.keyboard.down('KeyC')
					await page.keyboard.up('KeyA')
					await page.keyboard.up('KeyC')
					await expectToTrigger('KeyA+KeyC KeyB+KeyD', false)
					await page.keyboard.down('KeyB')
					await page.keyboard.down('KeyD')
					await expectToTrigger('KeyA+KeyC KeyB+KeyD', true)
					await page.keyboard.up('KeyB')
					await page.keyboard.up('KeyD')
				})

				it('KeyA+KeyC KeyB+KeyD fires when pressing KeyC+KeyA followed by KeyD+KeyB', async () => {
					await expectToTrigger('KeyA+KeyC KeyB+KeyD', false)
					await page.keyboard.down('KeyC')
					await page.keyboard.down('KeyA')
					await page.keyboard.up('KeyA')
					await page.keyboard.up('KeyC')
					await expectToTrigger('KeyA+KeyC KeyB+KeyD', false)
					await page.keyboard.down('KeyD')
					await page.keyboard.down('KeyB')
					await expectToTrigger('KeyA+KeyC KeyB+KeyD', true)
					await page.keyboard.up('KeyB')
					await page.keyboard.up('KeyD')
				})

				it("KeyA+KeyC KeyB+KeyD doesn't fire when pressing KeyB+KeyD", async () => {
					await expectToTrigger('KeyA+KeyC KeyB+KeyD', false)
					await page.keyboard.down('KeyB')
					await page.keyboard.down('KeyD')
					await expectToTrigger('KeyA+KeyC KeyB+KeyD', false)
					await page.keyboard.up('KeyB')
					await page.keyboard.up('KeyD')
				})

				it("KeyA+KeyC KeyB+KeyD doesn't fire when pressing KeyB+KeyD followed by KeyA+KeyC", async () => {
					await expectToTrigger('KeyA+KeyC KeyB+KeyD', false)
					await page.keyboard.down('KeyB')
					await page.keyboard.down('KeyD')
					await page.keyboard.up('KeyB')
					await page.keyboard.up('KeyD')
					await expectToTrigger('KeyA+KeyC KeyB+KeyD', false)
					await page.keyboard.down('KeyA')
					await page.keyboard.down('KeyC')
					await expectToTrigger('KeyA+KeyC KeyB+KeyD', false)
					await page.keyboard.up('KeyA')
					await page.keyboard.up('KeyC')
				})
			})

			describe('modifiersFirst', () => {
				beforeAll(async () => {
					await bindCombo('Ctrl+Shift+KeyK KeyC', {
						ordered: 'modifiersFirst',
					})
				})

				it('Ctrl+Shift+KeyK KeyC fires when pressing Ctrl+Shift+KeyK followed by KeyC', async () => {
					await expectToTrigger('Ctrl+Shift+KeyK KeyC', false)
					await page.keyboard.down('ControlLeft')
					await page.keyboard.down('ShiftLeft')
					await page.keyboard.down('KeyK')
					await expectToTrigger('Ctrl+Shift+KeyK KeyC', false)
					await page.keyboard.up('KeyK')
					await page.keyboard.up('ControlLeft')
					await page.keyboard.up('ShiftLeft')
					await expectToTrigger('Ctrl+Shift+KeyK KeyC', false)
					await page.keyboard.down('KeyC')
					await expectToTrigger('Ctrl+Shift+KeyK KeyC', true)
					await page.keyboard.up('KeyC')
				})

				it('Ctrl+Shift+KeyK KeyC fires when pressing Shift+Ctrl+KeyK followed by KeyC', async () => {
					await expectToTrigger('Ctrl+Shift+KeyK KeyC', false)
					await page.keyboard.down('ShiftLeft')
					await page.keyboard.down('ControlLeft')
					await page.keyboard.down('KeyK')
					await expectToTrigger('Ctrl+Shift+KeyK KeyC', false)
					await page.keyboard.up('KeyK')
					await page.keyboard.up('ControlLeft')
					await page.keyboard.up('ShiftLeft')
					await expectToTrigger('Ctrl+Shift+KeyK KeyC', false)
					await page.keyboard.down('KeyC')
					await expectToTrigger('Ctrl+Shift+KeyK KeyC', true)
					await page.keyboard.up('KeyC')
				})

				it("Ctrl+Shift+KeyK KeyC doesn't fire when pressing KeyK+Shift+Ctrl followed by KeyC", async () => {
					await expectToTrigger('Ctrl+Shift+KeyK KeyC', false)
					await page.keyboard.down('KeyK')
					await page.keyboard.down('ShiftLeft')
					await page.keyboard.down('ControlLeft')
					await expectToTrigger('Ctrl+Shift+KeyK KeyC', false)
					await page.keyboard.up('KeyK')
					await page.keyboard.up('ControlLeft')
					await page.keyboard.up('ShiftLeft')
					await expectToTrigger('Ctrl+Shift+KeyK KeyC', false)
					await page.keyboard.down('KeyC')
					await expectToTrigger('Ctrl+Shift+KeyK KeyC', false)
					await page.keyboard.up('KeyC')
				})
			})
		})
	})
})
