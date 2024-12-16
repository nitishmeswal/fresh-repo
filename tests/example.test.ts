// import { useTheme } from "next-themes"
import { describe, expect, it} from "vitest"

const perfectString = (str: string): string => {
    const checker: string[] = [];
    
    for (let i = 0; i < str.length; i++) {
        const current = str[i];
        
        if (current === "{" || current === "[" || current === "(" || current === "<" || current === '"' || current === "'") {
            if ((current === '"' || current === "'") && checker[checker.length - 1] === current) {
                checker.pop(); 
            } else {
                checker.push(current);
            }
        }
        else if (
            (current === "}" && checker[checker.length - 1] === "{") ||
            (current === "]" && checker[checker.length - 1] === "[") ||
            (current === ")" && checker[checker.length - 1] === "(") ||
            (current === ">" && checker[checker.length - 1] === "<") || 
            (current === '"' && checker[checker.length - 1] === '"') ||
            (current === "'" && checker[checker.length - 1] === "'")
        ) {
            checker.pop();
        }
    }
    
    return checker.length === 0 ? "Perfect" : "Not Perfect";
};



describe("example test", ()=> {
    it("theme testing 1", ()=>{
        // const { theme } = useTheme();
        const values = ["light", "dark"]
        expect(values[0]).toBe("light")
    });
});

describe("perfectString", ()=> {
    it("testcase:1", ()=>{
        const values = 
        ` function NotFound() {
            const router = useRouter();
            
            const handleClick = () => {
              router.push('/');
            };
            
            return (
              <div className="min-h-screen dark:bg-white bg-black dark:text-black text-white flex flex-col items-center justify-center p-4">
                <div className="text-center">
                  <h1 className="text-6xl font-bold dark:texttext-gray-800 -gray-200 mb-4">404</h1>
                  <h2 className="text-3xl font-semibold dark:text-gray-700 text-gray-300 mb-6">
                    NOT FOUND
                  </h2>
                  <p className="dark:text-gray-600 text-gray-400 mb-8">
                    Sorry, we can&apos;t seem to find this page. The page may not exist or an error has occurred.
                  </p>
                  <Button 
                    onClick={handleClick} 
                    className="dark:bg-black dark:text-white bg-white text-black dark:hover:bg-gray-800 hover:bg-gray-200"
                  >
                    Back To Dashboard
                  </Button>
                </div>
              </div>
            );
          }
        `
        const value = perfectString(values)
        expect(value).toBe("Perfect")
    });

    it("testcase:2", ()=>{
        const values = 
        ` function NotFound() {
            const router = useRouter();
            
            const handleClick = () => {
              router.push('/');
            };
            
            return (
              <div className="min-h-screen dark:bg-white bg-black dark:text-black text-white flex flex-col items-center justify-center p-4">
                <div className="text-center">
                  <h1 className="text-6xl font-bold dark:texttext-gray-800 -gray-200 mb-4">404</h1>
                  <h2 className="text-3xl font-semibold dark:text-gray-700 text-gray-300 mb-6">
                    NOT FOUND
                  </h2>
                  <p className="dark:text-gray-600 text-gray-400 mb-8">
                    Sorry, we can&apos;t seem to find this page. The page may not exist or an error has occurred.
                  </p>
                  <Button 
                    onClick={handleClick} 
                    className="dark:bg-black dark:text-white bg-white text-black dark:hover:bg-gray-800 hover:bg-gray-200"
                  >
                    Back To Dashboard
                  </Button>
                </div>
              </div>
            );
          }
        `
        const value = perfectString(values)
        expect(value).toBe("Perfect")
    })
    it("testcase:3", ()=>{
        const values = `
        use client"`
        const value = perfectString(values)
        expect(value).toBe("Not Perfect")
    })
    it("testcase:4", ()=>{
        const values = `
        import { Button } from '@/components/ui/button';
        import { useRouter } from 'next/navigation';`
        const value = perfectString(values)
        expect(value).toBe("Perfect")
    })

})