describe 'sanity check'
	describe 'javascript arrays'
		it 'should eql values explicitly pushed'
			stack = []
			
			stack.should.eql []
			
			stack = [100]
			
			stack.should.eql [100]
			
			stack.push(5)
			
			stack.should.eql [100, 5]
			
			stack.should.include 5
			stack.should.include 100
		end
	end
end