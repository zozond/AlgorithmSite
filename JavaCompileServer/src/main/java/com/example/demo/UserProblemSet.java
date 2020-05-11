package com.example.demo;

public class UserProblemSet {
	private String userId;
	private String problemName;
	private String code;
	private String problemInputCase;
	private String problemOutputCase;
	
	public void setUserId(String userId) {
		this.userId = userId;
	}

	public void setProblemName(String problemName) {
		this.problemName = problemName;
	}

	public void setCode(String code) {
		this.code = code;
	}
	
	public void setProblemInputCase(String problemInputCase) {
		this.problemInputCase = problemInputCase;
	}

	public void setProblemOutputCase(String problemOutputCase) {
		this.problemOutputCase = problemOutputCase;
	}
	
	
	public String getUserId() {
		return this.userId;
	}

	public String getProblemName() {
		return this.problemName ;
	}

	public String getCode() {
		return this.code;
	}
	public String getProblemInputCase() {
		return this.problemInputCase;
	}

	public String getProblemOutputCase() {
		return this.problemOutputCase;
	}
	public String toString() {
		return this.userId + ":" + this.problemName + ":" + this.code;
	}
}
