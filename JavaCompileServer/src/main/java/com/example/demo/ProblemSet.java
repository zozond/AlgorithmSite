package com.example.demo;

public class ProblemSet {
	private String problemName;
	private String problemContent;
	private String problemTestInput;
	private String problemTestOutput;
	private String problemInputCase;
	private String problemOutputCase;

	public void setProblemName(String problemName) {
		this.problemName = problemName;
	}

	public void setProblemContent(String problemContent) {
		this.problemContent = problemContent;
	}

	public void setProblemTestInput(String problemTestInput) {
		this.problemTestInput = problemTestInput;
	}

	public void setProblemTestOutput(String problemTestOutput) {
		this.problemTestOutput = problemTestOutput;
	}

	public void setProblemInputCase(String problemInputCase) {
		this.problemInputCase = problemInputCase;
	}

	public void setProblemOutputCase(String problemOutputCase) {
		this.problemOutputCase = problemOutputCase;
	}
	
	public String getProblemName() {
		return this.problemName;
	}

	public String getProblemContent() {
		return this.problemContent;
	}

	public String getProblemTestInput() {
		return this.problemTestInput ;
	}

	public String getProblemTestOutput() {
		return this.problemTestOutput;
	}

	public String getProblemInputCase() {
		return this.problemInputCase;
	}

	public String getProblemOutputCase() {
		return this.problemOutputCase;
	}
	
	public String toString() {
		return this.problemName + " " + this.problemContent + this.problemTestInput;
	}
}
